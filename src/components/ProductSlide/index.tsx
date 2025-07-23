import { useEffect, useState } from 'react';
import { API_URL } from '../../configs/env';
import { ProductInterface } from '../../interfaces';
import Carousel from './Carousel';
import ActionColumn from './ActionColumn';
import DescriptionOverlay from './DescriptionOverlay';
import './ProductSlide.css';

interface Props {
  product: ProductInterface;
}

const ProductSlide: React.FC<Props> = ({ product }) => {
  const [details, setDetails] = useState<ProductInterface | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/etsy/shopListing/listing/${product.listing_id}&includes=Shop,Images,Videos`);
        const data = await res.json();
        setDetails(data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    fetchDetails();
  }, [product.listing_id]);

  const media = [...(details?.videos || []), ...(details?.images || [])];
  if (media.length === 0) return null;

  return (
    <div
        className="feed-container position-relative d-flex w-100 rounded-4 my-1"
        style={{ minWidth: 'calc(500px - 9.5rem)', minHeight: 'calc(888.889px - 16.8889rem)', scrollSnapAlign: 'start', overflow: 'hidden' }}
    >
        {/* Main: 90% */}
        <div className="flex-grow-1" style={{ width: '90%', position: 'relative' }}>
        <Carousel
            media={media}
            currentIndex={index}
            onPrev={() => setIndex((index - 1 + media.length) % media.length)}
            onNext={() => setIndex((index + 1) % media.length)}
        />
        <DescriptionOverlay
            title={product.title}
            productUrl={product.url}
            price={product.price.amount / 100}
            description={product.description}
            tags={product.tags}
        />
        </div>

        {/* Lat: 10% */}
        <div className="d-flex justify-content-center align-items-center" style={{ width: '10%' }}>
            <ActionColumn 
              likes={product.num_favorers}
              profileImg={details?.shop?.icon_url_fullxfull ||''}
              shopUrl={ details?.shop?.url || '#'}
              productId={product.listing_id}/>
        </div>
    </div>
    );
};

export default ProductSlide;