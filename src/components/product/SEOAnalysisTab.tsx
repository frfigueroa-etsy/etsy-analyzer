import React from 'react';
import { ProductInterface } from '../../interfaces';

interface Props {
  product: ProductInterface;
}

const SEOAnalysisTab: React.FC<Props> = ({ product }) => {
  return (
    <div>
      <h6 className="fw-bold">🔍 SEO Analysis (placeholder)</h6>
      <p>Title: {product.title}</p>
    </div>
  );
};

export default SEOAnalysisTab;