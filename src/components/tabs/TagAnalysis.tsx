import { useEffect, useState } from 'react';
import { Product } from '../../interfaces';

const TagAnalysis = () => {
  const [tagFrequencies, setTagFrequencies] = useState<{ text: string; value: number }[]>([]);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get(['products'], (result) => {
        const data = result.products || [];
        computeTagData(data);
      });
    }
  }, []);

  const computeTagData = (products: Product[]) => {
    const tagCount: Record<string, number> = {};

    products.forEach((p) => {
      (p.tags || []).forEach((tag) => {
        const normalized = tag.toLowerCase();
        tagCount[normalized] = (tagCount[normalized] || 0) + 1;
      });
    });

    const sorted = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .map(([text, value]) => ({ text, value }));

    setTagFrequencies(sorted);
  };

  return (
    <div className="text-center">
      <h5 className="mb-3">🏷️ Tag Analysis</h5>

      <h6 className="mt-4">📋 Tag Frequency Table</h6>
      <div className="table-responsive">
        <table className="table table-sm table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th>Tag</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {tagFrequencies.map(({ text, value }) => (
              <tr key={text}>
                <td>{text}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h6 className="mt-4">🧠 Recommended (Coming Soon)</h6>
      <p className="text-muted">
        We'll soon show popular Etsy tags you might be missing like <em>"eco friendly"</em>, <em>"boho"</em>, or <em>"trendy"</em>.
      </p>
    </div>
  );
};

export default TagAnalysis;
