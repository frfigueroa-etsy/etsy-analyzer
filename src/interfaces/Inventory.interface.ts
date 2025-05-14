import { InventoryProduct } from "./";

export interface InventoryInterface {
    products: InventoryProduct[];
    price_on_property: number[];
    quantity_on_property: number[];
    sku_on_property: number[];
  }