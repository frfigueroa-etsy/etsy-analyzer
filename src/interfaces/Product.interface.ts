import {
  PriceInterface,
  ShippingProfileInterface,
  UserInterface,
  ShopInterface,
  ProductImageInterface,
  ProductVideoInterface,
  InventoryInterface,
  ProductionPartnerInterface
} from './';


export interface ProductInterface {
  listing_id: number;
  price: PriceInterface;
  title: string;
  num_favorers: number;
  tags: string[];
  description: string;
  shop_id: number;

  user_id?: number;
  state?: string;
  creation_timestamp?: number;
  created_timestamp?: number;
  ending_timestamp?: number;
  original_creation_timestamp?: number;
  last_modified_timestamp?: number;
  updated_timestamp?: number;
  state_timestamp?: number;
  quantity?: number;
  shop_section_id?: number;
  featured_rank?: number;
  url?: string;
  non_taxable?: boolean;
  is_taxable?: boolean;
  is_customizable?: boolean;
  is_personalizable?: boolean;
  personalization_is_required?: boolean;
  personalization_char_count_max?: number;
  personalization_instructions?: string;
  listing_type?: string;
  materials?: string[];
  shipping_profile_id?: number;
  return_policy_id?: number;
  processing_min?: number;
  processing_max?: number;
  who_made?: string;
  when_made?: string;
  is_supply?: boolean;
  item_weight?: number;
  item_weight_unit?: string;
  item_length?: number;
  item_width?: number;
  item_height?: number;
  item_dimensions_unit?: string;
  is_private?: boolean;
  style?: string[];
  file_data?: string;
  has_variations?: boolean;
  should_auto_renew?: boolean;
  language?: string;

  taxonomy_id?: number;
  shipping_profile?: ShippingProfileInterface;
  user?: UserInterface;
  shop?: ShopInterface;
  images?: ProductImageInterface[];
  videos?: ProductVideoInterface[];
  inventory?: InventoryInterface;
  production_partners?: ProductionPartnerInterface[];
  skus?: string[];
  translations?: Record<string, any>;
  views?: number;
}
