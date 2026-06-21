/**
 * Products (home goods) for the single store (EUR).
 * Each carries cost, price, supplier link, and a cost confidence.
 *
 * The "missing-COGS cohort" (unitCost null / costConfidence "missing") is
 * applied at the scenario layer, not here — base data is fully confirmed.
 */

import type { Product } from "@/data/schema";

/** Category lookup used by selectors / tables. */
export const PRODUCT_CATEGORY: Record<string, string> = {
  "prod-linen-throw": "Textiles",
  "prod-wool-blanket": "Textiles",
  "prod-cushion-cover": "Textiles",
  "prod-ceramic-vase": "Ceramics",
  "prod-stoneware-mug": "Ceramics",
  "prod-serving-bowl": "Ceramics",
  "prod-oak-shelf": "Furniture",
  "prod-oak-tray": "Furniture",
  "prod-side-table": "Furniture",
  "prod-table-lamp": "Lighting",
  "prod-pendant-light": "Lighting",
  "prod-candle-set": "Lighting",
  "prod-planter": "Garden",
  "prod-watering-can": "Garden",
  "prod-jute-rug": "Rugs",
  "prod-bath-towel": "Textiles",
  "prod-table-runner": "Textiles",
  "prod-apron": "Textiles",
};

export const PRODUCTS: Product[] = [
  { id: "prod-linen-throw", storeId: "store-northstar", title: "Stonewashed Linen Throw", sku: "NS-TEX-001", price: 89.0, currency: "EUR", unitCost: 31.5, costConfidence: "confirmed", supplierIds: ["sup-aurora"], status: "active" },
  { id: "prod-wool-blanket", storeId: "store-northstar", title: "Merino Wool Blanket", sku: "NS-TEX-002", price: 139.0, currency: "EUR", unitCost: 58.0, costConfidence: "confirmed", supplierIds: ["sup-aurora"], status: "active" },
  { id: "prod-cushion-cover", storeId: "store-northstar", title: "Linen Cushion Cover", sku: "NS-TEX-003", price: 34.0, currency: "EUR", unitCost: 9.8, costConfidence: "confirmed", supplierIds: ["sup-aurora"], status: "active" },
  { id: "prod-ceramic-vase", storeId: "store-northstar", title: "Handthrown Ceramic Vase", sku: "NS-CER-001", price: 64.0, currency: "EUR", unitCost: 21.0, costConfidence: "confirmed", supplierIds: ["sup-meridian"], status: "active" },
  { id: "prod-stoneware-mug", storeId: "store-northstar", title: "Stoneware Mug Set (4)", sku: "NS-CER-002", price: 48.0, currency: "EUR", unitCost: 16.4, costConfidence: "confirmed", supplierIds: ["sup-meridian"], status: "active" },
  { id: "prod-serving-bowl", storeId: "store-northstar", title: "Glazed Serving Bowl", sku: "NS-CER-003", price: 52.0, currency: "EUR", unitCost: 18.0, costConfidence: "estimated", supplierIds: ["sup-meridian"], status: "active" },
  { id: "prod-oak-shelf", storeId: "store-northstar", title: "Floating Oak Shelf", sku: "NS-FUR-001", price: 112.0, currency: "EUR", unitCost: 44.0, costConfidence: "confirmed", supplierIds: ["sup-nordwood"], status: "active" },
  { id: "prod-oak-tray", storeId: "store-northstar", title: "Oak Serving Tray", sku: "NS-FUR-002", price: 58.0, currency: "EUR", unitCost: 22.5, costConfidence: "confirmed", supplierIds: ["sup-nordwood"], status: "active" },
  { id: "prod-table-lamp", storeId: "store-northstar", title: "Ceramic Table Lamp", sku: "NS-LIT-001", price: 98.0, currency: "EUR", unitCost: 37.0, costConfidence: "confirmed", supplierIds: ["sup-lumiere"], status: "active" },
  { id: "prod-candle-set", storeId: "store-northstar", title: "Soy Candle Set (3)", sku: "NS-LIT-003", price: 39.0, currency: "EUR", unitCost: 11.2, costConfidence: "confirmed", supplierIds: ["sup-lumiere"], status: "active" },
  { id: "prod-planter", storeId: "store-northstar", title: "Glazed Stoneware Planter", sku: "NS-GAR-001", price: 44.0, currency: "EUR", unitCost: 15.0, costConfidence: "confirmed", supplierIds: ["sup-verdant"], status: "active" },
  { id: "prod-jute-rug", storeId: "store-northstar", title: "Handwoven Jute Rug", sku: "NS-RUG-001", price: 159.0, currency: "EUR", unitCost: 64.0, costConfidence: "confirmed", supplierIds: ["sup-verdant"], status: "active" },
  { id: "prod-bath-towel", storeId: "store-northstar", title: "Turkish Cotton Towel Set", sku: "NS-TEX-004", price: 72.0, currency: "EUR", unitCost: 24.0, costConfidence: "confirmed", supplierIds: ["sup-atlas"], status: "active" },
  { id: "prod-apron", storeId: "store-northstar", title: "Linen Kitchen Apron", sku: "NS-TEX-006", price: 38.0, currency: "EUR", unitCost: 12.5, costConfidence: "confirmed", supplierIds: ["sup-atlas"], status: "draft" },

  { id: "prod-side-table", storeId: "store-northstar", title: "Oak Side Table", sku: "NL-FUR-003", price: 189.0, currency: "EUR", unitCost: 78.0, costConfidence: "confirmed", supplierIds: ["sup-nordwood"], status: "active" },
  { id: "prod-pendant-light", storeId: "store-northstar", title: "Brass Pendant Light", sku: "NL-LIT-002", price: 134.0, currency: "EUR", unitCost: 52.0, costConfidence: "confirmed", supplierIds: ["sup-lumiere"], status: "active" },
  { id: "prod-watering-can", storeId: "store-northstar", title: "Galvanised Watering Can", sku: "NL-GAR-002", price: 41.0, currency: "EUR", unitCost: 14.0, costConfidence: "confirmed", supplierIds: ["sup-verdant"], status: "active" },
  { id: "prod-table-runner", storeId: "store-northstar", title: "Linen Table Runner", sku: "NL-TEX-005", price: 29.0, currency: "EUR", unitCost: 9.0, costConfidence: "confirmed", supplierIds: ["sup-atlas"], status: "active" },
];

const PRODUCT_INDEX = new Map(PRODUCTS.map((p) => [p.id, p]));

export function getProduct(id: string): Product | undefined {
  return PRODUCT_INDEX.get(id);
}
