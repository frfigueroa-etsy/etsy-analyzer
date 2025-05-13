import { useState } from 'react';
import { API_URL } from './configs/env';


const App = () => {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    if (!keyword) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/etsy/shopListing/search?q=${encodeURIComponent(keyword)}`);
      const data = await response.json();

      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        await chrome.storage.local.set({ products: data.results || [] });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }

    setLoading(false);
  };

  const openResultsTab = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url: chrome.runtime.getURL('results.html') });
    }
  };
  return (
    <div className="container p-3" style={{ width: 350, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h1 className="h5 fw-bold text-dark mb-3">Etsy Analyzer</h1>

      <div className="mb-3">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search a product..."
          className="form-control"
        />
      </div>

      <div className="d-flex gap-2 mb-4">
        <button
          onClick={async () => {
            await fetchProducts();
            openResultsTab();
          }}
          disabled={loading}
          className="btn btn-warning w-100"
        >
          {loading ? "Searching..." : "Search and Open Results"}
        </button>
      </div>
    </div>
  );
};

export default App;