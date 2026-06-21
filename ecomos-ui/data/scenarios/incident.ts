import type { ScenarioConfig } from "./types";

/** Aurora supplier delay cascading into WISMO, refunds, and margin impact. */
export const CONFIG: ScenarioConfig = { empty: false, incidentActive: true, includeIncident: true, cogsMissing: false, metaStale: false, payoutsOffline: false, connectorsOffline: false, forceFreshness: null, marginTrend: { direction: "down", deltaPct: -11.2 }, minAlertRank: 0 };
