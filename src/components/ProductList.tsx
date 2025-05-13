import { useState } from 'react';
import { Product } from '../interfaces';
import { addProductToBenchmark } from '../utils/benchmark';
import { API_URL } from '../configs/env';

interface Props {
  products: Product[];
}

const ProductList: React.FC<Props> = ({ products }) => {
  const [seoAnalysis, setSeoAnalysis] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<number | null>(null);

  const analyzeSEO = async (product: Product) => {
    setLoading(product.listing_id);

    const prompt = `
Analyze this Etsy product from an SEO perspective:

Title: "${product.title}"
Description: "${product.description || ''}"
Tags: ${product.tags?.slice(0, 5).join(', ')}

Evaluate whether the title contains relevant keywords, if the description is engaging and uses helpful keywords, and whether the tags help improve visibility. Suggest improvements.
    `;

    try {
      const response = await fetch(`${API_URL}/ai/analyze-seo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      setSeoAnalysis((prev) => ({
        ...prev,
        [product.listing_id]: data.result
      }));
    } catch (error) {
      console.error("SEO Analysis Error:", error);
      setSeoAnalysis((prev) => ({
        ...prev,
        [product.listing_id]: 'Error analyzing SEO.'
      }));
    }

    setLoading(null);
  };

  if (!products.length) return null;

  const averagePrice = (
    products.reduce((acc, p) => acc + p.price.amount / 100, 0) / products.length
  ).toFixed(2);

  return (
    <div className="mt-4">
      <p className="small text-secondary mb-2">
        <strong className="text-dark">Average price:</strong> ${averagePrice} USD
      </p>
      <ul className="list-group shadow-sm border rounded">
  {products
    .slice() // ← copia defensiva para no mutar el estado original
    .sort((a, b) => b.num_favorers - a.num_favorers) // ← orden descendente
    .map((product) => (
      <li
        key={product.listing_id}
        className="list-group-item bg-white"
      >
        <a
          href={`https://www.etsy.com/listing/${product.listing_id}`}
          target="_blank"
          rel="noreferrer"
          className="fw-semibold text-dark text-decoration-none d-block mb-1"
        >
          {product.title}
        </a>
        <p className="small text-secondary mb-0">Favorites: {product.num_favorers}</p>
        <p className="small text-secondary mb-0">Price: ${(product.price.amount / 100).toFixed(2)}</p>
        <p className="small text-secondary mb-2">Tags: {product.tags?.slice(0, 3).join(', ')}</p>

        <button
          onClick={() => analyzeSEO(product)}
          disabled={loading === product.listing_id}
          className="btn btn-sm btn-warning mb-2"
        >
          {loading === product.listing_id ? "Analyzing..." : "Analyze SEO"}
        </button>
        <button
          className="btn btn-sm btn-success"
          onClick={() => addProductToBenchmark(product)}
        >
          ＋
        </button>

        {seoAnalysis[product.listing_id] && (
          <div className="bg-light p-2 rounded small text-secondary">
            <pre className="mb-0">{seoAnalysis[product.listing_id]}</pre>
          </div>
        )}
      </li>
  ))}
</ul>
    </div>
  );
};

export default ProductList;