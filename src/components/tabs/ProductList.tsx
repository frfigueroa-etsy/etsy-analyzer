import { ProductInterface } from '../../interfaces';
import ProductListItem from '../product/ProductListItem';

interface Props {
  products: ProductInterface[];
}

const ProductList: React.FC<Props> = ({ products }) => {
  if (!products.length) return null;

  const averagePrice = (
    products.reduce((acc, p) => acc + p.price.amount / 100, 0) / products.length
  ).toFixed(2);

  return (
    <div className="mt-4">
      <p className="small text-secondary mb-2">
        <strong className="text-dark">Average price:</strong> ${averagePrice} USD
      </p>
      <ul className="list-group shadow-sm border rounded">
        {products
          .slice()
          .sort((a, b) => b.num_favorers - a.num_favorers)
          .map((product) => (
            <ProductListItem key={product.listing_id} product={product} />
          ))}
      </ul>
    </div>
  );
};

export default ProductList;