import type { ScenarioConfig } from "./types";

/** Revenue available; COGS missing for a cohort; Meta stale; payouts disconnected. */
export const CONFIG: ScenarioConfig = { empty: false, incidentActive: false, includeIncident: false, cogsMissing: true, metaStale: true, payoutsOffline: true, connectorsOffline: false, forceFreshness: null, marginTrend: { direction: "down", deltaPct: -3.0 }, minAlertRank: 1 };
