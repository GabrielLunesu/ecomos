"use client";

import { useScenarioStore } from "@/data/scenario-store";
import { STORE } from "@/data/base/brand";
import { FreshnessIndicator } from "@/components/feedback/freshness-indicator";
import type { Freshness } from "@/data/schema";
import type { ScenarioId } from "@/data/scenario";

/** Per-scenario freshness so the context line tells the truth about the data. */
const FRESHNESS: Record<ScenarioId, Freshness> = {
  healthy: { updatedAt: "2026-06-20T08:52:00+02:00", sourceCount: 6, status: "healthy" },
  attention: { updatedAt: "2026-06-20T08:40:00+02:00", sourceCount: 6, status: "healthy" },
  incident: { updatedAt: "2026-06-20T08:55:00+02:00", sourceCount: 6, status: "healthy" },
  empty: { updatedAt: "2026-06-20T09:00:00+02:00", sourceCount: 0, status: "disconnected" },
  partial: { updatedAt: "2026-06-20T06:00:00+02:00", sourceCount: 4, status: "partial" },
  stale: { updatedAt: "2026-06-19T18:30:00+02:00", sourceCount: 6, status: "stale" },
  offline: { updatedAt: "2026-06-19T21:10:00+02:00", sourceCount: 6, status: "disconnected" },
};

export function PageContextMeta() {
  const scenario = useScenarioStore((s) => s.scenario);
  return (
    <>
      <span>{STORE.name}</span>
      <span className="text-muted-foreground/40">·</span>
      <FreshnessIndicator freshness={FRESHNESS[scenario]} />
    </>
  );
}

export function freshnessForScenario(scenario: ScenarioId): Freshness {
  return FRESHNESS[scenario];
}
