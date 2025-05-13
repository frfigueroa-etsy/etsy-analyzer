import { useEffect, useState } from 'react';
import { API_URL } from '../configs/env';

interface BenchmarkProduct {
  listing_id: number;
  title: string;
  description: string;
  tags: string[];
}

const BenchmarkQueue = () => {
  const [benchmark, setBenchmark] = useState<BenchmarkProduct[]>([]);
  const [benchmarkResult, setBenchmarkResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const loadBenchmark = () => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get(['benchmarkProducts'], (result) => {
        setBenchmark(result.benchmarkProducts || []);
      });
    }
  };

  const clearBenchmark = () => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.remove(['benchmarkProducts'], () => {
        setBenchmark([]);
        setBenchmarkResult('');
      });
    }
  };

  const runBenchmarkAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/ai/benchmark-analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ products: benchmark })
      });

      const data = await response.json();
      setBenchmarkResult(data.result || 'No recommendations received.');
    } catch (error) {
      console.error('Error running benchmark analysis:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBenchmark();
  }, []);

  return (
    <div className="text-center">
      <h5 className="mb-3">📊 Benchmark Queue</h5>
      {benchmark.length > 0 ? (
        <div className="p-2 border rounded bg-white mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="fw-bold mb-0">📊 Benchmark Queue</h6>
            <button onClick={clearBenchmark} className="btn btn-sm btn-outline-danger">🗑 Clear</button>
          </div>
          <ul className="list-group mb-2">
            {benchmark.map((p) => (
              <li key={p.listing_id} className="list-group-item p-2">
                <small className="fw-semibold">{p.title.slice(0, 50)}...</small>
              </li>
            ))}
          </ul>
          <button
            onClick={runBenchmarkAnalysis}
            disabled={loading}
            className="btn btn-outline-primary w-100"
          >
            {loading ? 'Analyzing...' : '🧠 Run Benchmark Analysis'}
          </button>

          {benchmarkResult && (
            <div className="mt-3 alert alert-info" style={{ whiteSpace: 'pre-wrap' }}>
              {benchmarkResult}
            </div>
          )}
        </div>
      ) : (
        <p className="text-muted">No products in benchmark list.</p>
      )}
    </div>
  );
};

export default BenchmarkQueue;
