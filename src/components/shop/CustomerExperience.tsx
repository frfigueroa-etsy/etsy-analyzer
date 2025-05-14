import { useEffect, useState } from 'react';
import { ShopInterface } from '../../interfaces';
import { API_URL } from '../../configs/env';
import ReactMarkdown from 'react-markdown';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';
import ShopReviews from '../shop/comercial-experience/ShopReviews';

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
      {halfStar && '⭐️'}
      {'☆'.repeat(emptyStars)}
    </>
  );
};

const CustomerExperience = ({ shop }: Props) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'ratingAnalysis'>('reviews');
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
          headers: { 'Content-Type': 'application/json' },
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

  const radialData = [
    {
      name: 'Rating',
      value: shop.review_average,
      fill: '#ffc107'
    }
  ];

  return (
    <div>
      {/* Tabs Navigation */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            ⭐ Reviews
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'ratingAnalysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('ratingAnalysis')}
          >
            📊 Rating Analysis
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      {activeTab === 'reviews' && <ShopReviews shopId={shop.shop_id} />}

      {activeTab === 'ratingAnalysis' && (
        <div>
          {/* Review Count */}
          <div className="mb-3">
            <h6 className="fw-semibold">Total Reviews</h6>
            <div className="progress" style={{ height: '20px' }}>
              <div
                className="progress-bar bg-info"
                role="progressbar"
                style={{ width: `${Math.min(shop.review_count, 500) / 5}%` }}
              >
                {shop.review_count}
              </div>
            </div>
          </div>

          {/* Review Average */}
          <div className="mb-4">
            <h6 className="fw-semibold">Average Rating</h6>
            <div className="mb-2">
              {renderStars(shop.review_average)}{' '}
              <span className="ms-2">({shop.review_average.toFixed(2)} / 5)</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                innerRadius="60%"
                outerRadius="100%"
                barSize={15}
                data={radialData}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  {...({ minAngle: 15 } as any)}
                  clockWise
                  dataKey="value"
                />
                <Legend
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  wrapperStyle={{ top: 0, left: 350, lineHeight: '24px' }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
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
      )}
    </div>
  );
};

export default CustomerExperience;
