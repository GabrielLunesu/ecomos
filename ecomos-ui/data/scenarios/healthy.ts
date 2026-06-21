import type { ScenarioConfig } from "./types";

/** Sources fresh, margin stable/up, ordinary volume, no systemic failure. */
export const CONFIG: ScenarioConfig = { empty: false, incidentActive: false, includeIncident: false, cogsMissing: false, metaStale: false, payoutsOffline: false, connectorsOffline: false, forceFreshness: "healthy", marginTrend: { direction: "up", deltaPct: 2.1 }, minAlertRank: 1 };
