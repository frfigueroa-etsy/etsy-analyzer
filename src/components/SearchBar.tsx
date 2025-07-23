import { useEffect, useState, useCallback, useRef } from 'react';
import { API_URL } from '../configs/env';

const SearchBar = ({ onSearch }: { onSearch: () => void }) => {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const lastKeywordRef = useRef(''); // to prevent loops

  const fetchProductsFromKeyword = useCallback(async (kw: string) => {
    if (!kw || kw === lastKeywordRef.current) return; // avoid loops

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/etsy/shopListing/search?q=${encodeURIComponent(kw)}`);
      const data = await response.json();

      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        await chrome.storage.local.set({ products: data.results || [], keyword: kw });
      }

      lastKeywordRef.current = kw; // update to avoid loops
      onSearch();
    } catch (error) {
      console.error("Error fetching products:", error);
    }

    setLoading(false);
  }, [onSearch]);

  // First Load
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get(['keyword'], (result) => {
        const initialKeyword = result.keyword || '';
        setKeyword(initialKeyword);
        lastKeywordRef.current = initialKeyword;
        fetchProductsFromKeyword(initialKeyword);
      });
    }
  }, [fetchProductsFromKeyword]);

  // Listener 
  useEffect(() => {
    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === 'local' && changes.keyword) {
        const newKeyword = changes.keyword.newValue || '';
        if (newKeyword !== lastKeywordRef.current) {
          setKeyword(newKeyword);
          fetchProductsFromKeyword(newKeyword);
        }
      }
    };

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, [fetchProductsFromKeyword]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') fetchProductsFromKeyword(keyword);
  };

  const handleClick = () => fetchProductsFromKeyword(keyword);

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
        onClick={handleClick}
        disabled={loading}
        className="btn btn-warning w-100"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
};

export default SearchBar;