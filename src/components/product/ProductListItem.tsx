// src/components/ProductListItem.tsx
import { useEffect, useState } from 'react';
import { ProductInterface } from '../../interfaces';
import { addProductToBenchmark } from '../../utils/benchmark';
import { selectProductShop } from '../../utils/shop';
import { selectProduct } from '../../utils/product';
import { API_URL } from '../../configs/env';
import ReactMarkdown from 'react-markdown';

interface Props {
  product: ProductInterface;
}

const ProductListItem: React.FC<Props> = ({ product }) => {
  const [details, setDetails] = useState<ProductInterface | null>(null);
  const [seoAnalysis, setSeoAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/etsy/shopListing/listing/${product.listing_id}&includes=Images`);
        const data = await res.json();
        setDetails(data);
      } catch (error) {
        console.error('Error fetching listing details:', error);
      }
    };
    fetchDetails();
  }, [product.listing_id]);

  const analyzeSEO = async () => {
    setLoading(true);
    const prompt = `
Analyze and give a score from 0 to 100 of this Etsy product from an SEO perspective:

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
      setSeoAnalysis(data.result || '');
    } catch (error) {
      console.error("SEO Analysis Error:", error);
      setSeoAnalysis('Error analyzing SEO.');
    }
    setLoading(false);
  };

  const thumbnail = details?.images?.sort((a, b) => a.rank - b.rank)?.[0]?.url_75x75 || '';

  return (
    <li className="list-group-item bg-white">
      <div className="d-flex align-items-start gap-2">
        {thumbnail && <img src={thumbnail} alt="Thumbnail" className="rounded" width={60} height={60} />}
        <div className="flex-grow-1">
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

          <div className="d-flex flex-wrap gap-2">
            <button onClick={analyzeSEO} disabled={loading} className="btn btn-sm btn-warning">
              {loading ? "Analyzing..." : "Analyze SEO"}
            </button>
            <button className="btn btn-sm btn-success" onClick={() => addProductToBenchmark(product)}>
              + Add to Benchmark Analysis
            </button>
            <button className="btn btn-sm btn-secondary" onClick={() => selectProductShop(product)}>
              + Add to Shop Analysis
            </button>
            <button className="btn btn-sm btn-warning" onClick={() => selectProduct(product)}>
              + Add to Product Analysis
            </button>
          </div>

          {seoAnalysis && (
            <div className="bg-light p-2 rounded small text-secondary mt-2">
              <ReactMarkdown>{seoAnalysis}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default ProductListItem;