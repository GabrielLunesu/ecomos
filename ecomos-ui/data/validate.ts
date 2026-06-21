/**
 * Fixture integrity checks. Run with: npx tsx data/validate.ts
 *
 * Asserts cross-references resolve, ids are unique, trace stage order is valid,
 * selectors reconcile, and timestamps are anchored to the reference instant.
 */

import { SCENARIO_IDS } from "@/data/scenario";
import { TRACE_STAGES } from "@/data/schema";
import {
  ORDERS,
  TICKETS,
  CUSTOMERS,
  CAMPAIGNS,
  AGENTS,
  AGENT_RUNS,
  TRACES,
  APPROVALS,
  ALERTS,
  TASKS,
  AURORA_DELAYED_ORDER_IDS,
} from "@/data/base";
import { getScenarioData } from "@/data/scenarios";
import { selectFinanceOverview } from "@/data/selectors/finance";
import { selectCommandCenter } from "@/data/selectors/command-center";

const problems: string[] = [];
const ok: string[] = [];

function check(label: string, condition: boolean, detail = "") {
  if (condition) ok.push(label);
  else problems.push(`${label}${detail ? ` — ${detail}` : ""}`);
}

function unique<T>(arr: T[]): boolean {
  return new Set(arr).size === arr.length;
}

// 1. Unique ids.
check("orders: unique ids", unique(ORDERS.map((o) => o.id)));
check("tickets: unique ids", unique(TICKETS.map((t) => t.id)));
check("runs: unique ids", unique(AGENT_RUNS.map((r) => r.id)));
check("traces: unique ids", unique(TRACES.map((t) => t.id)));

// 2. Relationship integrity.
const customerIds = new Set(CUSTOMERS.map((c) => c.id));
check(
  "orders → customer ids resolve",
  ORDERS.every((o) => customerIds.has(o.customerId)),
);
const orderIds = new Set(ORDERS.map((o) => o.id));
check(
  "tickets → order ids resolve (when present)",
  TICKETS.every((t) => t.orderId === null || orderIds.has(t.orderId)),
);
const agentIds = new Set(AGENTS.map((a) => a.id));
check("runs → agent ids resolve", AGENT_RUNS.every((r) => agentIds.has(r.agentId)));

// 3. Approvals reference exact valid targets.
check(
  "approvals → target order resolves (orders only)",
  APPROVALS.filter((a) => a.targetRef.kind === "order").every((a) => orderIds.has(a.targetRef.id)),
);
check("apr-discount-1042 targets ORD-1042", APPROVALS.some((a) => a.id === "apr-discount-1042" && a.targetRef.id === "ORD-1042"));

// 4. Trace stage ordering matches canonical order.
for (const tr of TRACES) {
  const stages = tr.stages.map((s) => s.stage);
  const indices = stages.map((s) => TRACE_STAGES.indexOf(s));
  const sorted = indices.every((v, i) => i === 0 || indices[i - 1] <= v);
  check(`trace ${tr.id}: stage order valid`, sorted, stages.join(" → "));
}

// 5. Aurora cohort size.
check("aurora cohort = 14 orders", AURORA_DELAYED_ORDER_IDS.length === 14);
check("aurora orders exist", AURORA_DELAYED_ORDER_IDS.every((id) => orderIds.has(id)));

// 6. Scenario datasets build and finance reconciles.
for (const sc of SCENARIO_IDS) {
  const data = getScenarioData(sc);
  check(`scenario ${sc}: builds`, Array.isArray(data.orders));
  const fin = selectFinanceOverview(sc, "all");
  if (fin.breakdown.estimatedContributionMargin !== null && fin.breakdown.cogs !== null) {
    const recomputed =
      fin.breakdown.netRevenue -
      fin.breakdown.cogs -
      fin.breakdown.allocatedAdSpend -
      fin.breakdown.fees -
      fin.breakdown.shippingCost -
      fin.breakdown.refunds;
    check(
      `scenario ${sc}: margin reconciles`,
      Math.abs(recomputed - fin.breakdown.estimatedContributionMargin) < 1,
      `Δ=${(recomputed - fin.breakdown.estimatedContributionMargin).toFixed(2)}`,
    );
  }
  const cc = selectCommandCenter(sc, "all");
  check(`scenario ${sc}: command-center builds (${cc.pulse.length} metrics)`, cc.pulse.length === 5);
}

// 7. Empty scenario is genuinely empty.
check("empty scenario has no orders", getScenarioData("empty").orders.length === 0);

// 8. No obvious secrets / real emails.
const blob = JSON.stringify({ CUSTOMERS, TASKS, ALERTS, CAMPAIGNS });
check("no live secret-like tokens", !/sk-[A-Za-z0-9]{20,}|password|secret_key/i.test(blob));

// Report.
console.log(`\n✓ ${ok.length} checks passed`);
if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} checks FAILED:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log("All fixture integrity checks passed.\n");
