import { useEffect, useState } from 'react';
import { ShopInterface } from '../../interfaces';
import { API_URL } from '../../configs/env';
import ReactMarkdown from 'react-markdown';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Props {
  shop: ShopInterface;
}

const CommercialAppeal = ({ shop }: Props) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const presenceData = [
    { name: 'Announcement', value: shop.announcement ? 1 : 0 },
    { name: 'Sale Message', value: shop.sale_message ? 1 : 0 },
    { name: 'Digital Sale Message', value: shop.digital_sale_message ? 1 : 0 }
  ];

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const runAnalysis = async () => {
      if (!shop) return;

      setLoading(true);
      setError(null);

      try {
        const body = {
          shop_name: shop.shop_name,
          title: shop.title,
          announcement: shop.announcement,
          sale_message: shop.sale_message,
          digital_sale_message: shop.digital_sale_message
        };

        const response = await fetch(`${API_URL}/ai/analyze-commercial-appeal`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        const data = await response.json();
        if (data?.result) {
          setAnalysis(data.result);
        } else {
          setError('No analysis received.');
        }
      } catch (err: any) {
        console.error('Error analyzing commercial appeal:', err);
        setError('Failed to analyze commercial appeal.');
      } finally {
        setLoading(false);
      }
    };

    runAnalysis();
  }, [shop]);

  return (
    <div>
      {/* Shop header */}
      <div className="mb-3">
        <h6 className="text-primary mb-1">{shop.shop_name}</h6>
        <p className="mb-2"><strong>Title:</strong> {shop.title || <em>No title set</em>}</p>
      </div>

      {/* Pie chart of presence elements */}
      <div className="mb-4">
        <h6 className="fw-semibold">📊 Visual Presence Overview</h6>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={presenceData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={60}
              label
            >
              {presenceData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Commercial presence checklist */}
      <div className="mb-3">
        <h6 className="fw-semibold">📝 Presence Checklist</h6>
        <ul className="list-group">
          <li className="list-group-item d-flex justify-content-between align-items-center">
            Has Announcement
            <span className={`badge ${shop.announcement ? 'bg-success' : 'bg-secondary'}`}>
              {shop.announcement ? '✔️ Yes' : '❌ No'}
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            Has Sale Message
            <span className={`badge ${shop.sale_message ? 'bg-success' : 'bg-secondary'}`}>
              {shop.sale_message ? '✔️ Yes' : '❌ No'}
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            Has Digital Sale Message
            <span className={`badge ${shop.digital_sale_message ? 'bg-success' : 'bg-secondary'}`}>
              {shop.digital_sale_message ? '✔️ Yes' : '❌ No'}
            </span>
          </li>
        </ul>
      </div>

      {/* Vacation status */}
      <div className="mb-4">
        <h6 className="fw-semibold">🏖 Vacation Status</h6>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            disabled
            checked={shop.is_vacation}
            id="vacationToggle"
          />
          <label className="form-check-label" htmlFor="vacationToggle" title={shop.vacation_message || ''}>
            {shop.is_vacation ? 'On Vacation (hover for message)' : 'Not on Vacation'}
          </label>
        </div>
      </div>

      {/* OpenAI-generated analysis */}
      {loading && <p>Analyzing shop appeal...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && analysis && (
        <div className="alert alert-info text-start">
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default CommercialAppeal;
