import { useEffect, useState } from 'react';
import ProductFeedTab from '../components/tabs/Feed'
import ProductList from '../components/tabs/ProductList';
import Benchmark from '../components/tabs/Benchmark';
import ShopAnalysis from '../components/tabs/ShopAnalysis';
import ProductAnalysis from '../components/tabs/ProductAnalysis';
import SearchBar from '../components/SearchBar';
import { ProductInterface } from '../interfaces';

const ResultsPage = () => {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'results' | 'tags' | 'trends'| 'benchmark' | 'sales'| 'shop' | 'product'>('feed');

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
          <button className={`nav-link ${activeTab === 'feed' ? 'active' : ''}`} onClick={() => setActiveTab('feed')}>
            📱Feed
          </button>
        </li>
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
          <button className={`nav-link ${activeTab === 'product' ? 'active' : ''}`} onClick={() => setActiveTab('product')}>
            🎁 Product
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'shop' ? 'active' : ''}`} onClick={() => setActiveTab('shop')}>
            🛍️ Shop
          </button>
        </li>
      </ul>

      <div>
        {activeTab === 'feed' && <ProductFeedTab products={products} />}
        {activeTab === 'results' && <ProductList products={products} />}
        {activeTab === 'benchmark' && <Benchmark />}
        {activeTab === 'shop' && <ShopAnalysis />}
        {activeTab === 'product' && <ProductAnalysis />}
      </div>
    </div>
  );
};

export default ResultsPage;
