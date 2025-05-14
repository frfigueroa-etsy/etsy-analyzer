import { useEffect, useState } from 'react';
import ProductList from '../components/tabs/ProductList';
import TagAnalysis from '../components/tabs/TagAnalysis';
import TrendAnalysis from '../components/tabs/TredAnalysis';
import BenchmarkQueue from '../components/tabs/BenchmarkQueue';
import ShopInsights from '../components/tabs/ShopInsights';
import SearchBar from '../components/SearchBar';
import { Product } from '../interfaces';

const ResultsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'results' | 'tags' | 'trends'| 'benchmark' | 'sales'>('results');

  const loadProducts = () => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get(['products'], (result: { products?: Product[] }) => {
        if (result.products) {
          setProducts(result.products);
        } else {
          setProducts([]);
        }
      });
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="container p-3" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <h1 className="h5 fw-bold text-dark mb-3">Etsy Analyzer </h1>
      <SearchBar onSearch={loadProducts} />

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>
            🛒 Results
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'benchmark' ? 'active' : ''}`} onClick={() => setActiveTab('benchmark')}>
            📊 Benchmark Queue
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'tags' ? 'active' : ''}`} onClick={() => setActiveTab('tags')}>
            🏷️ Tags
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'trends' ? 'active' : ''}`} onClick={() => setActiveTab('trends')}>
            📈 Trends
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'sales' ? 'active' : ''}`} onClick={() => setActiveTab('sales')}>
            💰 Sales
          </button>
        </li>
      </ul>

      <div>
        {activeTab === 'results' && <ProductList products={products} />}
        {activeTab === 'benchmark' && <BenchmarkQueue />}
        {activeTab === 'tags' && <TagAnalysis />}
        {activeTab === 'trends' && <TrendAnalysis />}
        {activeTab === 'sales' && <ShopInsights />}
      </div>
    </div>
  );
};

export default ResultsPage;
