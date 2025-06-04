import { useEffect, useState } from 'react';
import SEOAnalysisTab from '../product/SEOAnalysisTab';
import ProductReviews from '../product/ProductReviews';
import ProductMediaTab from '../product/ProductMediaTab';
import { ProductInterface } from '../../interfaces';
import { API_URL } from '../../configs/env';

const ProductAnalysis = () => {
  const [activeTab, setActiveTab] = useState<'seo' | 'reviews' | 'media'>('reviews');
  const [product, setProduct] = useState<ProductInterface | null>(null);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get(['listingId'], async (result) => {
        const listingId = result.listingId;
        if (!listingId) return;

        try {
          const res = await fetch(`${API_URL}/etsy/shopListing/listing/${listingId}&includes=Images`);
          const data = await res.json();
          setProduct(data);
        } catch (error) {
          console.error('Error loading product data:', error);
        }
      });
    }
  }, []);

  const renderProductHeader = (p: ProductInterface) => {
    const image =
      p.images?.find((img) => img.rank === 1) ||
      p.images?.[0];

    return (
      <div className="mb-4 p-3 bg-light border rounded d-flex align-items-start gap-3">
        {image?.url_75x75 && (
          <img
            src={image.url_75x75}
            alt="Product Thumbnail"
            className="rounded border"
            style={{ width: 75, height: 75 }}
          />
        )}
        <div>
          <h5 className="mb-1 fw-semibold">{p.title}</h5>
          <p className="mb-1 text-muted">💰 ${(p.price.amount / 100).toFixed(2)} USD</p>
          <p className="mb-1 text-muted">❤️ {p.num_favorers} favorites</p>
          {p.url && (
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary mt-1">
              🔗 View on Etsy
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 bg-white border rounded">
      {product && renderProductHeader(product)}

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
            ⭐ Reviews
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'seo' ? 'active' : ''}`} onClick={() => setActiveTab('seo')}>
            🧠 SEO Analysis
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'media' ? 'active' : ''}`} onClick={() => setActiveTab('media')}>
            📸 Media
          </button>
        </li>
      </ul>

      {product ? (
        <>
          {activeTab === 'reviews' && <ProductReviews product={product} />}
          {activeTab === 'seo' && <SEOAnalysisTab product={product} />}
          {activeTab === 'media' && <ProductMediaTab product={product} />}
        </>
      ) : (
        <p className="text-muted">Loading product data...</p>
      )}
    </div>
  );
};

export default ProductAnalysis;