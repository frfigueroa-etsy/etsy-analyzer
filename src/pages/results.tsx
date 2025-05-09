import { useEffect, useState } from 'react';
import ProductList from '../components/ProductList';
import TagAnalysis from '../components/TagAnalysis';
import TrendAnalysis from '../components/TredAnalysis';
import BenchmarkQueue from '../components/BenchmarkQueue';
import { Product } from '../interfaces';

const ResultsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'results' | 'tags' | 'trends'| 'benchmark'>('results');

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get(['products'], (result: { products?: Product[] }) => {
        if (result.products) {
          console.log('Restoring products from chrome.storage:', result.products);
          setProducts(result.products);
        } else {
          console.log('No products found in storage.');
        }
      });
    }
  }, []);

  const exportToCSV = () => {
    const header = ['Title', 'Price', 'Favorites', 'Tags'];
    const rows = products.map(p => [
      `"${p.title}"`,
      (p.price.amount / 100).toFixed(2),
      p.num_favorers,
      `"${(p.tags || []).join(', ')}"`
    ]);

    const csvContent = [header, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'etsy_analysis.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container p-3" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <h1 className="h5 fw-bold text-dark mb-3">Etsy Analyzer - Full Results</h1>

      <div className="d-flex gap-2 mb-4">
        <button
          onClick={exportToCSV}
          disabled={!products.length}
          className="btn btn-outline-success w-100"
        >
          💾 Export CSV
        </button>
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            🛒 Results
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'benchmark' ? 'active' : ''}`}
            onClick={() => setActiveTab('benchmark')}
          >
            📊 Benchmark Queue
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'tags' ? 'active' : ''}`}
            onClick={() => setActiveTab('tags')}
          >
            🏷️ Tags
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'trends' ? 'active' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            📈 Trends
          </button>
        </li>
      </ul>

      <div>
        {activeTab === 'results' && <ProductList products={products} />}
        {activeTab === 'benchmark' && <BenchmarkQueue />}
        {activeTab === 'tags' && <TagAnalysis />}
        {activeTab === 'trends' && <TrendAnalysis />}
      </div>
    </div>
  );
};

export default ResultsPage;