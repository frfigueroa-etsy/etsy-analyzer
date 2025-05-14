import { OfferingInterface, PropertyValueInterface } from "./";
export interface InventoryProduct {
    product_id: number;
    sku: string;
    is_deleted: boolean;
    offerings: OfferingInterface[];
    property_values: PropertyValueInterface[];
  }