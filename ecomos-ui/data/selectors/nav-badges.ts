/**
 * Deterministic sidebar attention counts per scenario.
 * Reserved file (the shell owns nav badges); heavier page selectors live in
 * sibling files. Counts are intentionally consistent with the scenario story.
 */

import type { ScenarioId } from "@/data/scenario";
import type { BadgeKind } from "@/config/routes";

type NavBadgeCounts = Record<Exclude<BadgeKind, never>, number>;

const COUNTS: Record<ScenarioId, NavBadgeCounts> = {
  healthy: { inbox: 3, tasks: 2, approvals: 1, alerts: 1 },
  attention: { inbox: 7, tasks: 4, approvals: 2, alerts: 3 },
  incident: { inbox: 14, tasks: 6, approvals: 3, alerts: 5 },
  empty: { inbox: 0, tasks: 0, approvals: 0, alerts: 0 },
  partial: { inbox: 5, tasks: 3, approvals: 1, alerts: 2 },
  stale: { inbox: 4, tasks: 2, approvals: 1, alerts: 2 },
  offline: { inbox: 6, tasks: 3, approvals: 2, alerts: 4 },
};

export function getNavBadges(scenario: ScenarioId): NavBadgeCounts {
  return COUNTS[scenario];
}
