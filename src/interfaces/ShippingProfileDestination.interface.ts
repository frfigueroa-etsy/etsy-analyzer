import { PriceInterface } from "./Price.interface";
export interface ShippingProfileDestinationInterface {
    shipping_profile_destination_id: number;
    shipping_profile_id: number;
    origin_country_iso: string;
    destination_country_iso: string;
    destination_region: string;
    primary_cost: PriceInterface;
    secondary_cost: PriceInterface;
    shipping_carrier_id: number;
    mail_class: string;
    min_delivery_days: number;
    max_delivery_days: number;
  }