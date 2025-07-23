import ProductSlide from '../ProductSlide/index'
import { ProductInterface } from '../../interfaces';

interface Props {
  products: ProductInterface[];
}

const ProductFeedTab: React.FC<Props> = ({ products }) => {
  return (
    <div
      style={{
        margin: 'auto',
        height: '100vh',
        width: '96%',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
        backgroundColor: '#fff'
      }}
    >
      {products.map((product) => (
        <ProductSlide key={product.listing_id} product={product} />
      ))}
    </div>
  );
};

export default ProductFeedTab;