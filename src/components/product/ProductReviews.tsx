import React from 'react';
import { ProductInterface } from '../../interfaces';

interface Props {
  product: ProductInterface;
}

const ProductReviews: React.FC<Props> = ({ product }) => {
  return (
    <div>
      <h6 className="fw-bold">⭐ Reviews (placeholder)</h6>
      <p>Listing ID: {product.listing_id}</p>
    </div>
  );
};

export default ProductReviews;