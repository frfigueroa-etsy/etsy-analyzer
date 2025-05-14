export interface ReviewInterface {
    shop_id: number;
    listing_id: number;
    rating: number;
    review: string;
    language: string;
    image_url_fullxfull: string;
    create_timestamp: number;
    created_timestamp: number;
    update_timestamp: number;
    updated_timestamp: number;
  
    // (shop review)
    transaction_id?: number;
    buyer_user_id?: number;
  }