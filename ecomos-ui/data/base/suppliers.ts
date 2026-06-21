/**
 * Suppliers. Includes "Aurora Supply" — the supplier whose shipment delay
 * drives the incident scenario (14 affected orders → WISMO + refunds + margin).
 */

import type { Supplier } from "@/data/schema";

export const SUPPLIERS: Supplier[] = [
  {
    id: "sup-aurora",
    name: "Aurora Supply",
    region: "CN",
    productIds: ["prod-linen-throw", "prod-wool-blanket", "prod-cushion-cover"],
    status: "watch",
  },
  {
    id: "sup-meridian",
    name: "Meridian Ceramics",
    region: "PT",
    productIds: ["prod-ceramic-vase", "prod-stoneware-mug", "prod-serving-bowl"],
    status: "active",
  },
  {
    id: "sup-nordwood",
    name: "Nordwood Timber",
    region: "PL",
    productIds: ["prod-oak-shelf", "prod-oak-tray", "prod-side-table"],
    status: "active",
  },
  {
    id: "sup-lumiere",
    name: "Lumière Lighting",
    region: "DE",
    productIds: ["prod-table-lamp", "prod-pendant-light", "prod-candle-set"],
    status: "active",
  },
  {
    id: "sup-verdant",
    name: "Verdant Home",
    region: "NL",
    productIds: ["prod-planter", "prod-watering-can", "prod-jute-rug"],
    status: "active",
  },
  {
    id: "sup-atlas",
    name: "Atlas Textiles",
    region: "IN",
    productIds: ["prod-bath-towel", "prod-table-runner", "prod-apron"],
    status: "active",
  },
];

export function supplierName(id: string): string {
  return SUPPLIERS.find((s) => s.id === id)?.name ?? id;
}
