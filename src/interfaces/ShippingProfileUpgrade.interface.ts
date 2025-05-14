import { PriceInterface } from "./Price.interface";

export interface ShippingProfileUpgradeInterface {
    shipping_profile_id: number;
    upgrade_id: number;
    upgrade_name: string;
    type: string;
    rank: number;
    language: string;
    price: PriceInterface;
    secondary_price: PriceInterface;
    shipping_carrier_id: number;
    mail_class: string;
    min_delivery_days: number;
    max_delivery_days: number;
  }