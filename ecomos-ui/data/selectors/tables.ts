/**
 * Row selectors for dense tables (orders, tickets, campaigns, runs).
 */

import type { ScenarioId } from "@/data/scenario";
import type { AgentRun, Campaign, Order, Ticket } from "@/data/schema";
import type { StoreScope } from "@/data/scenario";
import { getScenarioData } from "@/data/scenarios";
import { filterOrdersByStore } from "./helpers";

export function selectOrders(scenarioId: ScenarioId, storeScope: StoreScope): Order[] {
  return filterOrdersByStore(getScenarioData(scenarioId).orders, storeScope);
}

export function selectTickets(scenarioId: ScenarioId, _storeScope: StoreScope): Ticket[] {
  return getScenarioData(scenarioId).tickets;
}

export function selectCampaigns(scenarioId: ScenarioId, _storeScope: StoreScope): Campaign[] {
  return getScenarioData(scenarioId).campaigns;
}

export function selectRuns(scenarioId: ScenarioId, _storeScope: StoreScope): AgentRun[] {
  return getScenarioData(scenarioId).runs;
}
