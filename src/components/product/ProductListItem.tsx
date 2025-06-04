// src/components/ProductListItem.tsx
import { useEffect, useState } from 'react';
import { ProductInterface } from '../../interfaces';
import { addProductToBenchmark } from '../../utils/benchmark';
import { selectProductShop } from '../../utils/shop';
import { selectProduct } from '../../utils/product';
import { API_URL } from '../../configs/env';


interface Props {
  product: ProductInterface;
}

const ProductListItem: React.FC<Props> = ({ product }) => {
  const [details, setDetails] = useState<ProductInterface | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/etsy/shopListing/listing/${product.listing_id}&includes=Images`);
        const data = await res.json();
        setDetails(data);
      } catch (error) {
        console.error('Error fetching listing details:', error);
      }
    };
    fetchDetails();
  }, [product.listing_id]);

  const thumbnail = details?.images?.sort((a, b) => a.rank - b.rank)?.[0]?.url_75x75 || '';

  return (
    <li className="list-group-item bg-white">
      <div className="d-flex align-items-start gap-2">
        {thumbnail && <img src={thumbnail} alt="Thumbnail" className="rounded" width={60} height={60} />}
        <div className="flex-grow-1">
          <a
            href={`https://www.etsy.com/listing/${product.listing_id}`}
            target="_blank"
            rel="noreferrer"
            className="fw-semibold text-dark text-decoration-none d-block mb-1"
          >
            {product.title}
          </a>
          <p className="small text-secondary mb-0">Favorites: {product.num_favorers}</p>
          <p className="small text-secondary mb-0">Price: ${(product.price.amount / 100).toFixed(2)}</p>
          <p className="small text-secondary mb-2">Tags: {product.tags?.slice(0, 3).join(', ')}</p>

          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-sm btn-success" onClick={() => addProductToBenchmark(product)}>
              + Add to Benchmark Analysis
            </button>
            <button className="btn btn-sm btn-info" onClick={() => selectProductShop(product)}>
              + Add to Shop Analysis
            </button>
            <button className="btn btn-sm btn-warning" onClick={() => selectProduct(product)}>
              + Add to Product Analysis
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ProductListItem;