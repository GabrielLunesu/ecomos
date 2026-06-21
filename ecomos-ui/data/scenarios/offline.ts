import type { ScenarioConfig } from "./types";

/** Shell navigable; connectors unavailable; execution simulations disabled. */
export const CONFIG: ScenarioConfig = { empty: false, incidentActive: false, includeIncident: true, cogsMissing: false, metaStale: false, payoutsOffline: true, connectorsOffline: true, forceFreshness: "disconnected", marginTrend: { direction: "flat", deltaPct: null }, minAlertRank: 2 };
