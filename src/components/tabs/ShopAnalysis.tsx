import { useEffect, useState } from 'react';
import { API_URL } from '../../configs/env';
import CommercialAppeal from '../shop/CommercialAppeal';
import CustomerExperience from '../shop/CustomerExperience';
import ListingConversion from '../shop/ListingConversion';
import ProfessionalBenchmark from '../shop/ProfessionalBenchmark';
import { ShopInterface } from '../../interfaces';

const ShopAnalysis = () => {
  const [shop, setShop] = useState<ShopInterface | null>(null);
  const [activeTab, setActiveTab] = useState<string>('commercial');

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get(['shopId'], async (result) => {
        const shopId = result.shopId;
        if (!shopId) return;

        try {
          console.log('Requesting shop:', shopId);
          const res = await fetch(`${API_URL}/etsy/shop/getShop/${shopId}`);
          const data = await res.json();
          setShop(data || null);
        } catch (error) {
          console.error('Error loading shop data:', error);
        }
      });
    }
  }, []);

  return (
    <div className="container p-3" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="fw-bold mb-0">
          🧠 Shop Analysis of {shop?.shop_name}
        </h5>
        {shop?.url && (
          <a
            href={shop.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline-primary"
          >
            🔗 Visit Shop
          </a>
        )}
      </div>

      {shop?.icon_url_fullxfull && (
        <div className="text-center mb-3">
          <img
            src={shop.icon_url_fullxfull}
            alt="Shop Banner"
            className="img-fluid rounded"
            style={{ maxHeight: '120px' }}
          />
        </div>
      )}

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'commercial' ? 'active' : ''}`} onClick={() => setActiveTab('commercial')}>
            🛍 Commercial Appeal
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'experience' ? 'active' : ''}`} onClick={() => setActiveTab('experience')}>
            ⭐ Customer Experience
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'conversion' ? 'active' : ''}`} onClick={() => setActiveTab('conversion')}>
            🔄 Listing Conversion
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'benchmark' ? 'active' : ''}`} onClick={() => setActiveTab('benchmark')}>
            📊 Professional Benchmark
          </button>
        </li>
      </ul>

      {shop ? (
        <>
          {activeTab === 'commercial' && <CommercialAppeal shop={shop} />}
          {activeTab === 'experience' && <CustomerExperience shop={shop} />}
          {activeTab === 'conversion' && <ListingConversion shop={shop} />}
          {activeTab === 'benchmark' && <ProfessionalBenchmark shop={shop} />}
        </>
      ) : (
        <p className="text-muted">Loading shop data...</p>
      )}
    </div>
  );
};

export default ShopAnalysis;