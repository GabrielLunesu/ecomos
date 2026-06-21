import type { ScenarioConfig } from "./types";

/** Margin down, one inefficient campaign, late orders, approvals pending. */
export const CONFIG: ScenarioConfig = { empty: false, incidentActive: false, includeIncident: false, cogsMissing: false, metaStale: true, payoutsOffline: false, connectorsOffline: false, forceFreshness: null, marginTrend: { direction: "down", deltaPct: -6.4 }, minAlertRank: 2 };
