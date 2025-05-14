import { useEffect, useState } from 'react';
import { ShopInterface } from '../../interfaces';
import { API_URL } from '../../configs/env';

interface Props {
  shop: ShopInterface;
}

const ProfessionalBenchmark = ({ shop }: Props) => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!shop) return;

      setLoading(true);
      try {
        const body = {
          is_etsy_payments_onboarded: shop.is_etsy_payments_onboarded,
          is_using_structured_policies: shop.is_using_structured_policies,
          has_onboarded_structured_policies: shop.has_onboarded_structured_policies
        };
        const response = await fetch(`${API_URL}/ai/analyze-professional-benchmark`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        const data = await response.json();
        setResult(data.result || 'No response from analysis.');
      } catch (error) {
        console.error('Error fetching professional benchmark analysis:', error);
        setResult('Failed to analyze professional readiness.');
      }
      setLoading(false);
    };

    fetchAnalysis();
  }, [shop]);

  const indicators = [
    { label: "Etsy Payments Onboarded", value: shop.is_etsy_payments_onboarded },
    { label: "Using Structured Policies", value: shop.is_using_structured_policies },
    { label: "Structured Policies Onboarded", value: shop.has_onboarded_structured_policies },
    { label: "Direct Checkout Enabled", value: shop.is_direct_checkout_onboarded },
  ];

  return (
    <div>
      <h5 className="fw-bold">📊 Professional Benchmark</h5>
      <p className="fw-semibold">Shop Name: {shop.shop_name}</p>

      {/* Visual Checklist */}
      <div className="mb-4">
        <h6 className="fw-bold mb-2">🧾 Key Professional Indicators</h6>
        <ul className="list-group">
          {indicators.map(({ label, value }) => (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={label}>
              {label}
              <span className={`badge ${value ? 'bg-success' : 'bg-danger'}`}>
                {value ? '✔️' : '❌'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* AI Analysis */}
      {loading ? (
        <p className="text-muted">Analyzing shop professionalism...</p>
      ) : (
        <div className="mt-3 alert alert-info text-start" style={{ whiteSpace: 'pre-line' }}>
          {result}
        </div>
      )}
    </div>
  );
};

export default ProfessionalBenchmark;