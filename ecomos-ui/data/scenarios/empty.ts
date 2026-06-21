import type { ScenarioConfig } from "./types";

/** Brand exists but no commerce or channel records yet. */
export const CONFIG: ScenarioConfig = { empty: true, incidentActive: false, includeIncident: false, cogsMissing: false, metaStale: false, payoutsOffline: false, connectorsOffline: false, forceFreshness: "disconnected", marginTrend: { direction: "flat", deltaPct: null }, minAlertRank: 5 };
