import { useEffect, useState } from 'react';
import { API_URL } from '../../configs/env';
import { ProductInterface, ProductImageInterface, ProductVideoInterface } from '../../interfaces';

// Props
interface Props {
  product: ProductInterface;
}

// Type guard
const isVideo = (media: ProductImageInterface | ProductVideoInterface): media is ProductVideoInterface => {
  return (media as ProductVideoInterface).video_url !== undefined;
};

const ProductSlide: React.FC<Props> = ({ product }) => {
  const [productDetails, setProductDetails] = useState<ProductInterface | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/etsy/shopListing/listing/${product.listing_id}&includes=Images,Videos`);
        const data = await res.json();
        setProductDetails(data);
      } catch (error) {
        console.error('Error fetching listing details:', error);
      }
    };
    fetchDetails();
  }, [product.listing_id]);

  const media = [...(productDetails?.videos || []), ...(productDetails?.images || [])];
  const hasMedia = media.length > 0;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  if (!hasMedia) return null;

  const current = media[currentIndex];

  return (
    <div className="position-relative" style={{ height: '100vh', scrollSnapAlign: 'start' }}>
      <div className="w-100 h-100 overflow-hidden position-relative">
        {isVideo(current) ? (
          <video
            src={current.video_url}
            autoPlay
            loop
            muted
            className="w-100 h-100 object-fit-cover"
          />
        ) : (
          <img
            src={current.url_fullxfull}
            alt={product.title}
            className="w-100 h-100 object-fit-cover"
          />
        )}

        {/* Carousel controls */}
        {media.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="position-absolute top-50 start-0 translate-middle-y bg-dark bg-opacity-50 text-white border-0 px-3 py-2"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              className="position-absolute top-50 end-0 translate-middle-y bg-dark bg-opacity-50 text-white border-0 px-3 py-2"
            >
              ›
            </button>
          </>
        )}
      </div>

      <div className="position-absolute bottom-0 w-100 text-white p-3 bg-gradient">
        <h5 className="fw-bold">{product.title}</h5>
        <p className="mb-1">💰 ${(product.price.amount / 100).toFixed(2)} USD</p>
        <p className="mb-1">❤️ {product.num_favorers} likes</p>
        <p className="small">{product.description}</p>
      </div>
    </div>
  );
};

export default ProductSlide;