import { useEffect, useState } from 'react';
import { API_URL } from '../../../configs/env';
import ReactMarkdown from 'react-markdown';
import { ReviewInterface } from '../../../interfaces';
import { addShopReviewToAnalysis } from '../../../utils/shopReviews';

interface Props {
  shopId: number;
}

const ShopReviews = ({ shopId }: Props) => {
  const [reviews, setReviews] = useState<ReviewInterface[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCount, setSelectedCount] = useState<number>(0);

  const updateReviewCount = () => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get(['reviewShopAnalysisQueue'], (result) => {
        const queue = result.reviewShopAnalysisQueue || [];
        setSelectedCount(queue.length);
      });
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/etsy/shop/reviews/${shopId}`);
        const data = await res.json();
        setReviews(data.results || []);
      } catch (error) {
        console.error('Error loading shop reviews:', error);
      }
    };

    fetchReviews();
    updateReviewCount();
  }, [shopId]);

  const runReviewAnalysis = async () => {
    setLoading(true);
    if (typeof chrome === 'undefined' || !chrome.storage?.local) return;

    chrome.storage.local.get(['reviewShopAnalysisQueue'], async (result) => {
      const queue: ReviewInterface[] = result.reviewShopAnalysisQueue || [];

      if (!queue.length) {
        setAnalysis('Review analysis queue is empty.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/ai/analyze-shop-reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reviews: queue })
        });
        const data = await response.json();
        setAnalysis(data.result || 'No analysis available.');
      } catch (err) {
        console.error('Error analyzing shop reviews:', err);
        setAnalysis('Error analyzing reviews.');
      }

      setLoading(false);
    });
  };

  const clearReviewAnalysisQueue = () => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.set({ reviewShopAnalysisQueue: [] }, () => {
        setSelectedCount(0);
        setAnalysis('');
      });
    }
  };

  const removeReviewFromAnalysis = (reviewToRemove: ReviewInterface) => {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) return;

    chrome.storage.local.get(['reviewShopAnalysisQueue'], (result) => {
      let queue = result.reviewShopAnalysisQueue || [];
      queue = queue.filter(
        (r: ReviewInterface) =>
          r.created_timestamp !== reviewToRemove.created_timestamp || r.shop_id !== reviewToRemove.shop_id
      );
      chrome.storage.local.set({ reviewShopAnalysisQueue: queue }, updateReviewCount);
    });
  };

  const handleAddToAnalysis = (review: ReviewInterface) => {
    addShopReviewToAnalysis(review);
    setTimeout(updateReviewCount, 100);
  };

  return (
    <div className="row">
      {/* Analysis Section */}
      <div className="col-md-6">
        <h6 className="fw-bold">🧠 Review Analysis</h6>
        <div className="d-flex gap-2 mb-2 align-items-center">
          <button onClick={runReviewAnalysis} disabled={loading} className="btn btn-sm btn-primary">
            {loading ? 'Analyzing...' : 'Run Review Analysis'}
          </button>
          <button onClick={clearReviewAnalysisQueue} className="btn btn-sm btn-outline-danger">
            🗑 Clear All
          </button>
          <span className="badge bg-secondary">{selectedCount} selected</span>
        </div>
        {analysis && (
          <div className="alert alert-info text-start">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* Review List Section */}
      <div className="col-md-6">
        <h6 className="fw-bold">⭐ Customer Reviews</h6>
        <ul className="list-group">
          {reviews.map((review) => (
            <li key={`${review.shop_id}-${review.created_timestamp}`} className="list-group-item">
              <p className="small text-muted mb-1">{review.review}</p>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-warning">Rating: {review.rating} / 5</span>
                <div className="btn-group">
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => handleAddToAnalysis(review)}
                  >
                    + Add
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeReviewFromAnalysis(review)}
                  >
                    🗑
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShopReviews;