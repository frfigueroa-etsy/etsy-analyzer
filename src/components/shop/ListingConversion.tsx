import { useEffect, useState } from 'react';
import { ShopInterface } from '../../interfaces';
import { API_URL } from '../../configs/env';
import ReactMarkdown from 'react-markdown';

interface Props {
  shop: ShopInterface;
}

const ListingConversion = ({ shop }: Props) => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const conversionRate =
    shop.listing_active_count > 0
      ? (shop.transaction_sold_count / shop.listing_active_count) * 100
      : 0;

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!shop) return;

      setLoading(true);

      try {
        const body = {
          listing_active_count: shop.listing_active_count,
          digital_listing_count: shop.digital_listing_count,
          transaction_sold_count: shop.transaction_sold_count
        };

        const response = await fetch(`${API_URL}/ai/analyze-listing-conversion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        const data = await response.json();
        setResult(data.result || 'No analysis available.');
      } catch (error) {
        console.error('Error analyzing listing conversion:', error);
        setResult('Failed to load analysis.');
      }

      setLoading(false);
    };

    fetchAnalysis();
  }, [shop]);

  const digitalPercent = shop.listing_active_count
    ? (shop.digital_listing_count / shop.listing_active_count) * 100
    : 0;

  const physicalPercent = 100 - digitalPercent;

  return (
    <div>
      <h5 className="fw-bold">🔄 Listing Conversion</h5>

      {/* Indicators Summary */}
      <div className="row mb-3 text-center">
        <div className="col">
          <h6>🛒 Active Listings</h6>
          <span className="badge bg-primary fs-6">{shop.listing_active_count}</span>
        </div>
        <div className="col">
          <h6>💾 Digital Listings</h6>
          <span className="badge bg-info text-dark fs-6">{shop.digital_listing_count}</span>
        </div>
        <div className="col">
          <h6>💰 Sales</h6>
          <span className="badge bg-success fs-6">{shop.transaction_sold_count}</span>
        </div>
      </div>

      {/* Digital vs Physical Pie (simple bar) */}
      <div className="mb-3">
        <h6>📊 Digital vs Physical</h6>
        <div className="progress" style={{ height: '20px' }}>
          <div
            className="progress-bar bg-info"
            style={{ width: `${digitalPercent}%` }}
            role="progressbar"
          >
            {digitalPercent.toFixed(1)}% Digital
          </div>
          <div
            className="progress-bar bg-secondary"
            style={{ width: `${physicalPercent}%` }}
            role="progressbar"
          >
            {physicalPercent.toFixed(1)}% Physical
          </div>
        </div>
      </div>

      {/* Conversion Indicator */}
      <div className="mb-3">
        <h6>📈 Conversion Rate</h6>
        <p>
          <strong>{conversionRate.toFixed(1)}%</strong>{' '}
          <small className="text-muted">
            ({shop.transaction_sold_count} sold / {shop.listing_active_count} active)
          </small>
        </p>
        <div className="progress" style={{ height: '8px' }}>
          <div
            className="progress-bar bg-warning"
            role="progressbar"
            style={{ width: `${Math.min(conversionRate, 100)}%` }}
          />
        </div>
      </div>

      {/* AI Analysis */}
      {loading ? (
        <p className="text-muted">Analyzing listing performance...</p>
      ) : (
        <div className="alert alert-info text-start mt-3">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default ListingConversion;