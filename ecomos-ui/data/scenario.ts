/**
 * Scenario + local-prototype state contract.
 *
 * The whole prototype is deterministic: every page derives its data from
 * pure selectors parameterized by the active scenario and store scope.
 * No randomness at render time.
 */

export const SCENARIO_IDS = [
  "healthy",
  "attention",
  "incident",
  "empty",
  "partial",
  "stale",
  "offline",
] as const;

export type ScenarioId = (typeof SCENARIO_IDS)[number];

export const SCENARIOS: Record<
  ScenarioId,
  { id: ScenarioId; label: string; description: string; tone: "neutral" | "info" | "warning" | "critical" }
> = {
  healthy: {
    id: "healthy",
    label: "Healthy day",
    description: "Sources fresh, margin stable, ordinary volume. Work exists but nothing systemic.",
    tone: "neutral",
  },
  attention: {
    id: "attention",
    label: "Attention required",
    description: "Margin down, one campaign inefficient, late orders, approvals pending.",
    tone: "warning",
  },
  incident: {
    id: "incident",
    label: "Incident",
    description: "Supplier delay cascading into WISMO tickets, refunds and margin impact.",
    tone: "critical",
  },
  empty: {
    id: "empty",
    label: "Empty / new brand",
    description: "Brand exists but no commerce or channel records yet. Setup-first states.",
    tone: "info",
  },
  partial: {
    id: "partial",
    label: "Partial data",
    description: "Revenue available, COGS missing for a cohort, Meta stale, payouts disconnected.",
    tone: "warning",
  },
  stale: {
    id: "stale",
    label: "Stale data",
    description: "Last-good records remain but timestamps are old. Some actions gated on refresh.",
    tone: "warning",
  },
  offline: {
    id: "offline",
    label: "Offline / degraded",
    description: "Shell navigable, connectors unavailable, execution simulations disabled.",
    tone: "critical",
  },
};

export const DEFAULT_SCENARIO: ScenarioId = "attention";

/** Local role preview — visual only, no real authentication. */
export const ROLE_IDS = [
  "owner",
  "admin",
  "cs-lead",
  "cs-rep",
  "finance",
  "viewer",
] as const;

export type RoleId = (typeof ROLE_IDS)[number];

export const ROLES: Record<RoleId, { id: RoleId; label: string; description: string }> = {
  owner: { id: "owner", label: "Owner", description: "Full access, including runtime and destructive actions." },
  admin: { id: "admin", label: "Admin", description: "Manage operations, agents, and integrations." },
  "cs-lead": { id: "cs-lead", label: "CS Lead", description: "Customer service oversight and approvals." },
  "cs-rep": { id: "cs-rep", label: "CS Representative", description: "Handle tickets; approvals require a lead." },
  finance: { id: "finance", label: "Finance", description: "Finance and reconciliation; read-only elsewhere." },
  viewer: { id: "viewer", label: "Viewer", description: "Read-only across the workspace." },
};

export const DEFAULT_ROLE: RoleId = "owner";

/** Store scope. "all" aggregates; named ids scope to one store. */
export type StoreScope = "all" | string;

/** Global analysis window. Drives analytical selectors + the header control. */
export const PERIODS = [
  { id: "7d", label: "Last 7 days", short: "7D", days: 7 },
  { id: "14d", label: "Last 14 days", short: "14D", days: 14 },
  { id: "30d", label: "Last 30 days", short: "30D", days: 30 },
  { id: "90d", label: "Last 90 days", short: "90D", days: 90 },
] as const;

export type PeriodId = (typeof PERIODS)[number]["id"];
export const DEFAULT_PERIOD: PeriodId = "30d";

export function periodMeta(id: PeriodId) {
  return PERIODS.find((p) => p.id === id) ?? PERIODS[2];
}
export function periodDays(id: PeriodId): number {
  return periodMeta(id).days;
}
