import { useEffect, useState } from 'react';
import { API_URL } from '../configs/env';

const SearchBar = ({ onSearch }: { onSearch: () => void }) => {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get(['keyword'], (result) => {
        if (result.keyword) setKeyword(result.keyword);
      });
    }
  }, []);

  const fetchProducts = async () => {
    if (!keyword) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/etsy/shopListing/search?q=${encodeURIComponent(keyword)}`);
      const data = await response.json();
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        await chrome.storage.local.set({ products: data.results || [], keyword });
      }
      onSearch();
    } catch (error) {
      console.error("Error fetching products:", error);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') fetchProducts();
  };

  return (
    <div className="mb-3">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search a keyword..."
        className="form-control mb-2"
      />
      <button
        onClick={fetchProducts}
        disabled={loading}
        className="btn btn-warning w-100"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
};

export default SearchBar;