export interface Product {
    listing_id: number;
    title: string;
    price: {
      amount: number;
    };
    num_favorers: number;
    tags: string[];
    description?: string;
  }