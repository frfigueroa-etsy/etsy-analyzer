import { useEffect, useState } from 'react';
import { ShopInterface } from '../../interfaces';
import { API_URL } from '../../configs/env';
import ReactMarkdown from 'react-markdown';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  shop: ShopInterface;
}

const COLORS = ['#00bcd4', '#9e9e9e'];

const ListingConversion = ({ shop }: Props) => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const conversionRate =
    shop.listing_active_count > 0
      ? (shop.transaction_sold_count / shop.listing_active_count) * 100
      : 0;

  const digitalPercent = shop.listing_active_count
    ? (shop.digital_listing_count / shop.listing_active_count) * 100
    : 0;

  const physicalPercent = 100 - digitalPercent;

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

      {/* Digital vs Physical Pie Chart */}
      <div className="mb-4">
        <h6>📊 Digital vs Physical Listings</h6>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={[{ name: 'Digital', value: digitalPercent }, { name: 'Physical', value: physicalPercent }]}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={60}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {COLORS.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Rate Bar Chart */}
      <div className="mb-4">
        <h6>📈 Conversion Rate</h6>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[{ name: 'Conversion', rate: conversionRate }]}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(value: any) => `${value.toFixed(2)}%`} />
            <Bar dataKey="rate" fill="#ffc107" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-center">
          <strong>{conversionRate.toFixed(1)}%</strong>{' '}
          <small className="text-muted">
            ({shop.transaction_sold_count} sold / {shop.listing_active_count} active)
          </small>
        </p>
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
