import { useEffect, useState } from 'react';
import { API_URL } from '../../configs/env';
import ReactMarkdown from 'react-markdown';
import Queue from '../benchmark/Queue';
import TagAnalysis from './TagAnalysis';
import TrendAnalysis from './TredAnalysis';
import {BenchmarkProductInterface } from '../../interfaces'


const Benchmark = () => {
  const [benchmark, setBenchmark] = useState<BenchmarkProductInterface[]>([]);
  const [benchmarkResult, setBenchmarkResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'queue' | 'tags' | 'trends'>('queue');

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

  const removeItem = (listing_id: number) => {
    const updated = benchmark.filter((p) => p.listing_id !== listing_id);
    setBenchmark(updated);
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.set({ benchmarkProducts: updated });
    }
  };

  const runBenchmarkAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/ai/benchmark-analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <div className="w-100">
      <h5 className="mb-3 text-center">📊 Benchmark Insights</h5>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${tab === 'queue' ? 'active' : ''}`} onClick={() => setTab('queue')}>🧺 Queue</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'tags' ? 'active' : ''}`} onClick={() => setTab('tags')}>🏷️ Tags</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'trends' ? 'active' : ''}`} onClick={() => setTab('trends')}>📈 Trends</button>
        </li>
      </ul>

      {tab === 'queue' && (
        <>
          <Queue benchmark={benchmark} onRemove={removeItem} onClear={clearBenchmark} />
          {benchmark.length > 0 && (
            <div className="text-center">
              <button
                onClick={runBenchmarkAnalysis}
                disabled={loading}
                className="btn btn-outline-primary w-50"
              >
                {loading ? 'Analyzing...' : '🧠 Run Benchmark Analysis'}
              </button>
              {benchmarkResult && (
                <div className="mt-3 alert alert-info text-start">
                  <ReactMarkdown>{benchmarkResult}</ReactMarkdown>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {tab === 'tags' && <TagAnalysis />}
      {tab === 'trends' && <TrendAnalysis />}
    </div>
  );
};

export default Benchmark;
