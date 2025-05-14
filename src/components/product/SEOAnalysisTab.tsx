import React, { useEffect, useState } from 'react';
import { ProductInterface } from '../../interfaces';
import { API_URL } from '../../configs/env';
import ReactMarkdown from 'react-markdown';

interface Props {
  product: ProductInterface;
}

const SEOAnalysisTab: React.FC<Props> = ({ product }) => {
  const [seoAnalysis, setSeoAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runAnalysis = async () => {
      if (!product) return;

      setLoading(true);
      setError(null);

      const prompt = `
Analyze and give a score from 0 to 100 of this Etsy product from an SEO perspective:

Title: "${product.title}"
Description: "${product.description || ''}"
Tags: ${product.tags?.slice(0, 5).join(', ')}

Evaluate whether the title contains relevant keywords, if the description is engaging and uses helpful keywords, and whether the tags help improve visibility. Suggest improvements.
      `;

      try {
        const response = await fetch(`${API_URL}/ai/analyze-seo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        setSeoAnalysis(data.result || 'No analysis provided.');
      } catch (err: any) {
        console.error('Error analyzing SEO:', err);
        setError('SEO analysis failed.');
      } finally {
        setLoading(false);
      }
    };

    runAnalysis();
  }, [product]);

  return (
    <div>
      <h6 className="fw-bold mb-2">🔍 SEO Analysis</h6>
      <p><strong>Product:</strong> {product.title}</p>

      {loading && <p className="text-muted">Analyzing SEO...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && seoAnalysis && (
        <div className="alert alert-info text-start">
          <ReactMarkdown>{seoAnalysis}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default SEOAnalysisTab;