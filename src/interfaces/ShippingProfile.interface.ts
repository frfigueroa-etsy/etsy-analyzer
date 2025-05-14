import { ShippingProfileDestinationInterface, ShippingProfileUpgradeInterface } from "./";

export interface ShippingProfileInterface {
    shipping_profile_id: number;
    title: string;
    user_id: number;
    min_processing_days: number;
    max_processing_days: number;
    processing_days_display_label: string;
    origin_country_iso: string;
    is_deleted: boolean;
    shipping_profile_destinations: ShippingProfileDestinationInterface[];
    shipping_profile_upgrades: ShippingProfileUpgradeInterface[];
    origin_postal_code: string;
    profile_type: string;
    domestic_handling_fee: number;
    international_handling_fee: number;
  }