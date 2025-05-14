import { useState } from 'react';
import FinancialAnalysis from '../sales/FinancialAnalysis';
import ProductSalesAnalysis from '../sales/ProductSalesAnalysis';
import StorePerformance from '../sales/StorePerformance';

const ShopInsights = () => {
  const [activeTab, setActiveTab] = useState<'financial' | 'products' | 'store'>('financial');

  return (
    <div className="container p-3" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <h1 className="h5 fw-bold text-dark mb-3">📊 Shop Insights</h1>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'financial' ? 'active' : ''}`}
            onClick={() => setActiveTab('financial')}
          >
            💰 Financial
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            📦 Product Sales
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'store' ? 'active' : ''}`}
            onClick={() => setActiveTab('store')}
          >
            🏪 Store Performance
          </button>
        </li>
      </ul>

      <div>
        {activeTab === 'financial' && <FinancialAnalysis />}
        {activeTab === 'products' && <ProductSalesAnalysis />}
        {activeTab === 'store' && <StorePerformance />}
      </div>
    </div>
  );
};

export default ShopInsights;
