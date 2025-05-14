import { useEffect, useState } from 'react';
import { API_URL } from '../../configs/env';
import ReactMarkdown from 'react-markdown';
import { ProductReviewInterface } from '../../interfaces';
import { addListingReviewToAnalysis } from '../../utils/listingReview';

interface Props {
  product: { listing_id: number; title: string };
}

const ProductReviews = ({ product }: Props) => {
  const [reviews, setReviews] = useState<ProductReviewInterface[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCount, setSelectedCount] = useState<number>(0);

  const updateReviewCount = () => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get(['reviewAnalysisQueue'], (result) => {
        const queue = result.reviewAnalysisQueue || [];
        setSelectedCount(queue.length);
      });
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/etsy/shopListing/reviews/listing/${product.listing_id}`);
        const data = await res.json();
        setReviews(data.results || []);
      } catch (error) {
        console.error('Error loading reviews:', error);
      }
    };

    fetchReviews();
    updateReviewCount();
  }, [product.listing_id]);

  const runReviewAnalysis = async () => {
    setLoading(true);
    try {
      if (typeof chrome === 'undefined' || !chrome.storage?.local) {
        setAnalysis('Chrome storage not available.');
        return;
      }

      chrome.storage.local.get(['reviewAnalysisQueue'], async (result) => {
        const queue: ProductReviewInterface[] = result.reviewAnalysisQueue || [];

        if (!queue.length) {
          setAnalysis('Review analysis queue is empty.');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/ai/analyze-listing-reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reviews: queue })
        });

        const data = await response.json();
        setAnalysis(data.result || 'No analysis available.');
        setLoading(false);
      });
    } catch (err) {
      console.error('Storage access error:', err);
      setAnalysis('Error accessing local review data.');
      setLoading(false);
    }
  };

  const clearReviewAnalysisQueue = () => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.set({ reviewAnalysisQueue: [] }, () => {
        setSelectedCount(0);
        setAnalysis('');
      });
    }
  };

  const removeReviewFromAnalysis = (reviewToRemove: ProductReviewInterface) => {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) return;

    chrome.storage.local.get(['reviewAnalysisQueue'], (result) => {
      let queue = result.reviewAnalysisQueue || [];
      queue = queue.filter(
        (r: ProductReviewInterface) =>
          r.created_timestamp !== reviewToRemove.created_timestamp || r.listing_id !== reviewToRemove.listing_id
      );
      chrome.storage.local.set({ reviewAnalysisQueue: queue }, updateReviewCount);
    });
  };

  const handleAddToAnalysis = (review: ProductReviewInterface) => {
    addListingReviewToAnalysis(review);
    setTimeout(updateReviewCount, 100); // Small delay to wait for storage write
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
            <li key={`${review.listing_id}-${review.created_timestamp}`} className="list-group-item">
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

export default ProductReviews;