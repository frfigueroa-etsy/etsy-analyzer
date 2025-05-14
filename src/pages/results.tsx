import { useEffect, useState } from 'react';
import ProductList from '../components/tabs/ProductList';
import Benchmark from '../components/tabs/Benchmark';
import ShopAnalysis from '../components/tabs/ShopAnalysis';
import SalesInsights from '../components/tabs/SalesInsights';
import SearchBar from '../components/SearchBar';
import { ProductInterface } from '../interfaces';

const ResultsPage = () => {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [activeTab, setActiveTab] = useState<'results' | 'tags' | 'trends'| 'benchmark' | 'sales'| 'shop'>('results');

  const loadProducts = () => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get(['products'], (result: { products?: ProductInterface[] }) => {
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
          <button className={`nav-link ${activeTab === 'shop' ? 'active' : ''}`} onClick={() => setActiveTab('shop')}>
            🛍️ Shop
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
        {activeTab === 'benchmark' && <Benchmark />}
        {activeTab === 'shop' && <ShopAnalysis />}
        {activeTab === 'sales' && <SalesInsights />}
      </div>
    </div>
  );
};

export default ResultsPage;
