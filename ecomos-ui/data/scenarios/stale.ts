import type { ScenarioConfig } from "./types";

/** Last-good records remain but timestamps are old; some actions gated. */
export const CONFIG: ScenarioConfig = { empty: false, incidentActive: false, includeIncident: false, cogsMissing: false, metaStale: false, payoutsOffline: false, connectorsOffline: false, forceFreshness: "stale", marginTrend: { direction: "flat", deltaPct: 0.2 }, minAlertRank: 1 };
