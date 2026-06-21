/**
 * Scenario assembler. Given a scenario id, transform the base fixtures into a
 * deterministic scenario-scoped dataset that selectors consume.
 *
 * Scenarios never invent conflicting totals — they filter/annotate base records
 * so the same order/ticket reads consistently across every page.
 */

import type { ScenarioId } from "@/data/scenario";
import type { Alert, SourceConnection, Severity } from "@/data/schema";
import type { ScenarioData, ScenarioConfig } from "./types";

import { CONFIG as healthy } from "./healthy";
import { CONFIG as attention } from "./attention";
import { CONFIG as incident } from "./incident";
import { CONFIG as empty } from "./empty";
import { CONFIG as partial } from "./partial";
import { CONFIG as stale } from "./stale";
import { CONFIG as offline } from "./offline";

import { ORDERS, AURORA_DELAYED_ORDER_IDS } from "@/data/base/orders";
import { TICKETS } from "@/data/base/tickets";
import { CAMPAIGNS } from "@/data/base/campaigns";
import { OPERATIONS_EXCEPTIONS } from "@/data/base/operations";
import { ALERTS, APPROVALS, TASKS, ACTIVITY_EVENTS } from "@/data/base/activity";
import { AGENT_RUNS } from "@/data/base/runs";
import { CHANNELS } from "@/data/base/brand";

export type { ScenarioData, ScenarioConfig } from "./types";

const CONFIGS: Record<ScenarioId, ScenarioConfig> = {
  healthy,
  attention,
  incident,
  empty,
  partial,
  stale,
  offline,
};

const SEVERITY_RANK: Record<Severity, number> = { info: 0, low: 1, medium: 2, high: 3, critical: 4 };

const CHANNEL_TO_SOURCE_KIND: Record<string, SourceConnection["kind"]> = {
  commerce: "commerce",
  ads: "ads",
  inbox: "inbox",
  payments: "payments",
  communication: "communication",
};

function buildSources(config: ScenarioConfig): SourceConnection[] {
  return CHANNELS.map((c) => {
    let status: SourceConnection["status"] = "healthy";
    if (config.connectorsOffline) status = "disconnected";
    else if (config.forceFreshness) status = config.forceFreshness;
    if (config.metaStale && c.name.includes("Meta")) status = "stale";
    if (config.payoutsOffline && c.kind === "payments") status = "disconnected";
    if (config.empty) status = "disconnected";
    return {
      id: `src-${c.id}`,
      name: c.name,
      kind: CHANNEL_TO_SOURCE_KIND[c.kind],
      lastSyncAt: status === "disconnected" ? null : c.lastSyncAt,
      status,
      missingDataNote:
        status === "stale" ? "Last sync is older than the freshness threshold." : status === "disconnected" ? "Connection unavailable." : undefined,
    };
  });
}

export function getScenarioData(scenarioId: ScenarioId): ScenarioData {
  const config = CONFIGS[scenarioId];

  if (config.empty) {
    return {
      orders: [],
      tickets: [],
      campaigns: [],
      exceptions: [],
      alerts: [],
      approvals: [],
      tasks: [],
      activity: [],
      runs: [],
      sources: buildSources(config),
      config,
    };
  }

  // The Aurora delayed cohort is the incident — only present when the incident
  // is in play. Elsewhere those 14 recent orders would distort trends.
  const auroraSet = new Set(AURORA_DELAYED_ORDER_IDS);
  let orders = config.includeIncident ? ORDERS.slice() : ORDERS.filter((o) => !auroraSet.has(o.id));

  // Missing-COGS case (partial data): strip COGS from the most recent ~42
  // orders, independent of the incident.
  if (config.cogsMissing) {
    const recent = new Set(
      [...orders]
        .sort((a, b) => (a.placedAt < b.placedAt ? 1 : -1))
        .slice(0, 42)
        .map((o) => o.id),
    );
    orders = orders.map((o) =>
      recent.has(o.id) ? { ...o, cogs: null, contributionMargin: null, costConfidence: "missing" as const } : o,
    );
  }

  // Exceptions: only include the Aurora supplier-delay when the incident is in play.
  const exceptions = OPERATIONS_EXCEPTIONS.filter(
    (e) => config.includeIncident || e.kind !== "supplier-delay",
  );

  // Alerts: severity floor; drop the Aurora alert unless the incident is included.
  const alerts: Alert[] = ALERTS.filter((a) => {
    if (!config.includeIncident && a.relatedEntityIds.includes("EXC-aurora")) return false;
    if (!config.metaStale && a.id === "ALR-meta-stale") return false;
    return SEVERITY_RANK[a.severity] >= config.minAlertRank;
  });

  return {
    orders,
    tickets: TICKETS,
    campaigns: CAMPAIGNS,
    exceptions,
    alerts,
    approvals: APPROVALS,
    tasks: TASKS,
    activity: ACTIVITY_EVENTS,
    runs: AGENT_RUNS,
    sources: buildSources(config),
    config,
  };
}
