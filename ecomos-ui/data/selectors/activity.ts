/**
 * Activity & Traces overview selector. Returns a filterable, time-sorted event
 * timeline plus quick counts by actor kind.
 */

import type { ScenarioId } from "@/data/scenario";
import type { ActivityEvent, ActorKind } from "@/data/schema";
import type { StoreScope } from "@/data/scenario";
import { getScenarioData } from "@/data/scenarios";

export type ActivityFilter = { actorKinds?: ActorKind[]; department?: string };

export type ActivityOverviewData = {
  events: ActivityEvent[];
  countsByActor: Record<ActorKind, number>;
  total: number;
  isEmpty: boolean;
};

export function selectActivityTimeline(
  scenarioId: ScenarioId,
  storeScope: StoreScope,
  filter: ActivityFilter = {},
): ActivityOverviewData {
  const data = getScenarioData(scenarioId);
  let events = [...data.activity];

  if (storeScope !== "all") {
    events = events.filter((e) => e.storeId === storeScope || e.storeId === null);
  }
  if (filter.actorKinds && filter.actorKinds.length > 0) {
    events = events.filter((e) => filter.actorKinds!.includes(e.actorKind));
  }
  if (filter.department) {
    events = events.filter((e) => e.department === filter.department);
  }

  events.sort((a, b) => (a.at < b.at ? 1 : -1));

  const countsByActor: Record<ActorKind, number> = { human: 0, agent: 0, system: 0, connector: 0, approval: 0 };
  for (const e of data.activity) countsByActor[e.actorKind] += 1;

  return { events, countsByActor, total: data.activity.length, isEmpty: data.activity.length === 0 };
}
