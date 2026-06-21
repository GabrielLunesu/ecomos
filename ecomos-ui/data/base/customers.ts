/**
 * Customers (fictional, safe @example.com addresses).
 *
 * 30 customers split across the two stores. `cust-vip-anna` is the VIP behind
 * the €248 order ORD-1042; `cust-refund-marek` is behind the refunded ORD-1188
 * and ticket TKT-1188. Lifetime values are reconciled to their orders by the
 * customers selector / validate.ts, so these are deterministic baselines.
 */

import type { Customer } from "@/data/schema";
import { daysAgo, seededFloat, seededInt, seededPick, money } from "./_seed";

const SEGMENTS = ["new", "returning", "vip", "at-risk"] as const;

const NAMES: { id: string; name: string; store: "store-northstar" }[] = [
  { id: "cust-vip-anna", name: "Anna de Vries", store: "store-northstar" },
  { id: "cust-refund-marek", name: "Marek Novák", store: "store-northstar" },
  { id: "cust-noorder-fatima", name: "Fatima El Amrani", store: "store-northstar" },
  { id: "cust-0004", name: "Liam Johansson", store: "store-northstar" },
  { id: "cust-0005", name: "Sofia Rossi", store: "store-northstar" },
  { id: "cust-0006", name: "Daniel Becker", store: "store-northstar" },
  { id: "cust-0007", name: "Emma Lindqvist", store: "store-northstar" },
  { id: "cust-0008", name: "Lucas Moreau", store: "store-northstar" },
  { id: "cust-0009", name: "Ines Costa", store: "store-northstar" },
  { id: "cust-0010", name: "Mateo García", store: "store-northstar" },
  { id: "cust-0011", name: "Hannah Schmidt", store: "store-northstar" },
  { id: "cust-0012", name: "Oliver Hansen", store: "store-northstar" },
  { id: "cust-0013", name: "Clara Janssen", store: "store-northstar" },
  { id: "cust-0014", name: "Noah Andersen", store: "store-northstar" },
  { id: "cust-0015", name: "Maja Kowalski", store: "store-northstar" },
  { id: "cust-0016", name: "Elias Virtanen", store: "store-northstar" },
  { id: "cust-0017", name: "Julia Nowak", store: "store-northstar" },
  { id: "cust-0018", name: "Felix Wagner", store: "store-northstar" },
  { id: "cust-0019", name: "Alice Dubois", store: "store-northstar" },
  { id: "cust-0020", name: "Theo Berg", store: "store-northstar" },
  { id: "cust-0021", name: "Grace Murphy", store: "store-northstar" },
  { id: "cust-0022", name: "Harry Clarke", store: "store-northstar" },
  { id: "cust-0023", name: "Olivia Bennett", store: "store-northstar" },
  { id: "cust-0024", name: "George Wright", store: "store-northstar" },
  { id: "cust-0025", name: "Amelia Hughes", store: "store-northstar" },
  { id: "cust-0026", name: "Jack Thompson", store: "store-northstar" },
  { id: "cust-0027", name: "Isla Robertson", store: "store-northstar" },
  { id: "cust-0028", name: "Charlie Evans", store: "store-northstar" },
  { id: "cust-0029", name: "Freya Mitchell", store: "store-northstar" },
  { id: "cust-0030", name: "Oscar Walsh", store: "store-northstar" },
];

function emailFor(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z]+/g, ".")
    .replace(/^\.|\.$/g, "");
  return `${slug}@example.com`;
}

export const CUSTOMERS: Customer[] = NAMES.map((entry, i) => {
  const currency = entry.store === "store-northstar" ? "EUR" : "GBP";

  // Deterministic baseline LTV; specific customers are pinned for the story.
  let segment = seededPick(i + 7, SEGMENTS);
  let ordersCount = seededInt(i + 3, 1, 6);
  let lifetimeRevenue = money(seededFloat(i + 11, 80, 1400));

  if (entry.id === "cust-vip-anna") {
    segment = "vip";
    ordersCount = 6;
    lifetimeRevenue = 1840.0;
  } else if (entry.id === "cust-refund-marek") {
    segment = "at-risk";
    ordersCount = 3;
    lifetimeRevenue = 412.0;
  } else if (entry.id === "cust-noorder-fatima") {
    // Ticket without a matched order: a prospect who never converted.
    segment = "new";
    ordersCount = 0;
    lifetimeRevenue = 0;
  }

  const lifetimeMargin = money(lifetimeRevenue * seededFloat(i + 19, 0.28, 0.42));
  const firstOrderDays = seededInt(i + 23, 30, 180);
  const lastOrderDays = seededInt(i + 29, 1, 28);

  return {
    id: entry.id,
    name: entry.name,
    email: emailFor(entry.name),
    storeId: entry.store,
    firstOrderAt: ordersCount > 0 ? daysAgo(firstOrderDays) : null,
    lastOrderAt: ordersCount > 0 ? daysAgo(lastOrderDays) : null,
    ordersCount,
    lifetimeRevenue,
    lifetimeMargin,
    currency,
    segment,
    ticketIds: [],
  };
});

const CUSTOMER_INDEX = new Map(CUSTOMERS.map((c) => [c.id, c]));

export function getCustomer(id: string): Customer | undefined {
  return CUSTOMER_INDEX.get(id);
}
