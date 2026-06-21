import type {
  ActivityEvent,
  AgentRun,
  Alert,
  Approval,
  Campaign,
  OperationsException,
  Order,
  SourceConnection,
  Task,
  Ticket,
  Trend,
} from "@/data/schema";

/** A scenario's declarative intent — interpreted by getScenarioData. */
export interface ScenarioConfig {
  /** No commerce/channel records at all (new brand). */
  empty: boolean;
  /** The Aurora supplier incident is active and cross-propagates. */
  incidentActive: boolean;
  /** Include the Aurora exception + its critical alert. */
  includeIncident: boolean;
  /** Drop the missing-COGS cohort's COGS and mark margin partial. */
  cogsMissing: boolean;
  /** Meta Ads data is stale. */
  metaStale: boolean;
  /** Payout source is disconnected. */
  payoutsOffline: boolean;
  /** All connectors unavailable; execution simulations disabled. */
  connectorsOffline: boolean;
  /** Force every source's freshness to this status (null = per-source default). */
  forceFreshness: SourceConnection["status"] | null;
  /** Synthetic margin trend for the headline metric. */
  marginTrend: Trend;
  /** Only include alerts at or above this severity rank (0=info..4=critical). */
  minAlertRank: number;
}

/** The scenario-scoped dataset consumed by selectors. */
export interface ScenarioData {
  orders: Order[];
  tickets: Ticket[];
  campaigns: Campaign[];
  exceptions: OperationsException[];
  alerts: Alert[];
  approvals: Approval[];
  tasks: Task[];
  activity: ActivityEvent[];
  runs: AgentRun[];
  sources: SourceConnection[];
  config: ScenarioConfig;
}
