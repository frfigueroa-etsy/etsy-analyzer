import SearchBar from './components/SearchBar';

const App = () => {
  const openResultsTab = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url: chrome.runtime.getURL('results.html') });
    }
  };
  return (
    <div className="container p-3" style={{ width: 350, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h5 fw-bold text-dark m-0">Etsy Analyzer</h1>
        <button onClick={openResultsTab} className="btn btn-sm btn-outline-secondary">
          🔍 Open Results
        </button>
      </div>

      <SearchBar onSearch={openResultsTab} />
    </div>
  );
};

export default App;