import { useEffect, useState } from 'react';
import { ShopInterface } from '../../interfaces';
import { API_URL } from '../../configs/env';
import ReactMarkdown from 'react-markdown';

interface Props {
  shop: ShopInterface;
}

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <>
      {'⭐️'.repeat(fullStars)}
      {halfStar && '⭐️'}{/* Optional half if needed */}
      {'☆'.repeat(emptyStars)}
    </>
  );
};

const CustomerExperience = ({ shop }: Props) => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!shop) return;
      setLoading(true);

      try {
        const body = {
          review_count: shop.review_count,
          review_average: shop.review_average,
          accepts_custom_requests: shop.accepts_custom_requests
        };

        const response = await fetch(`${API_URL}/ai/analyze-customer-experience`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        const data = await response.json();
        setResult(data.result || 'No analysis available.');
      } catch (error) {
        console.error('Error fetching customer experience analysis:', error);
        setResult('Error generating analysis.');
      }

      setLoading(false);
    };

    fetchAnalysis();
  }, [shop]);

  return (
    <div>
      {/* Review Count */}
      <div className="mb-3">
        <h6 className="fw-semibold">Total Reviews</h6>
        <div className="progress" style={{ height: '20px' }}>
          <div
            className="progress-bar bg-info"
            role="progressbar"
            style={{
              width: `${Math.min(shop.review_count, 500) / 5}%`,
            }}
          >
            {shop.review_count}
          </div>
        </div>
      </div>

      {/* Review Average */}
      <div className="mb-3">
        <h6 className="fw-semibold">Average Rating</h6>
        <div>
          {renderStars(shop.review_average)} <span className="ms-2">({shop.review_average.toFixed(2)} / 5)</span>
        </div>
        <div className="progress mt-1" style={{ height: '8px' }}>
          <div
            className="progress-bar bg-warning"
            role="progressbar"
            style={{ width: `${(shop.review_average / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Custom Requests */}
      <div className="mb-4">
        <h6 className="fw-semibold">Custom Requests</h6>
        <span className={`badge ${shop.accepts_custom_requests ? 'bg-success' : 'bg-secondary'}`}>
          {shop.accepts_custom_requests ? '✔️ Accepts Custom Requests' : '❌ Does Not Accept Custom Requests'}
        </span>
      </div>

      {/* OpenAI Result */}
      {loading ? (
        <p className="text-muted">Analyzing customer experience...</p>
      ) : (
        <div className="alert alert-info text-start">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default CustomerExperience;