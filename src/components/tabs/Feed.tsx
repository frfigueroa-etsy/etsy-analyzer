import ProductSlide from '../product/ProductSlide'
import { ProductInterface } from '../../interfaces';

interface Props {
  products: ProductInterface[];
}

const ProductFeedTab: React.FC<Props> = ({ products }) => {
  return (
    <div
      style={{
        height: '100vh',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
        backgroundColor: '#000'
      }}
    >
      {products.map((product) => (
        <ProductSlide key={product.listing_id} product={product} />
      ))}
    </div>
  );
};

export default ProductFeedTab;