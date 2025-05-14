import { PriceInterface } from "./Price.interface";
export interface OfferingInterface {
    offering_id: number;
    quantity: number;
    is_enabled: boolean;
    is_deleted: boolean;
    price: PriceInterface;
  }