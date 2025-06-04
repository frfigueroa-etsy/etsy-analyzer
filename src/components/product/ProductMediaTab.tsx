import { useEffect, useState } from 'react';
import { API_URL } from '../../configs/env';

interface Props {
  product: { listing_id: number; title: string };
}

interface ListingImage {
  listing_id: number;
  listing_image_id: number;
  url_170x135: string;
  url_fullxfull: string;
  alt_text: string;
  rank: number;
}

const ProductMediaTab = ({ product }: Props) => {
  const [images, setImages] = useState<ListingImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<Record<number, string>>({});
  const [videoLoading, setVideoLoading] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/etsy/shopListing/images/listing/${product.listing_id}`);
        const data = await res.json();
        setImages(data.results || []);
      } catch (err) {
        console.error('Error fetching images:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [product.listing_id]);

  const handleAnalyzeImage = async (image: ListingImage) => {
    try {
      const res = await fetch(`${API_URL}/ai/analyze-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imgUrl: image.url_fullxfull })
      });

      const data = await res.json();
      setAnalysis((prev) => ({ ...prev, [image.listing_image_id]: data.result || 'No response' }));
    } catch (err) {
      console.error('Image analysis failed:', err);
      setAnalysis((prev) => ({ ...prev, [image.listing_image_id]: 'Error analyzing image.' }));
    }
  };

const handleGenerateVideo = async (image: ListingImage) => {
    const promptText = window.prompt('Describe the style or content of the video you want to generate for this product image:');
    if (!promptText) return;

    setVideoLoading(prev => ({ ...prev, [image.listing_image_id]: true }));

    try {
        const res = await fetch(`${API_URL}/ai/video-creation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            imgUrl: image.url_fullxfull,
            promptText
        })
        });

        const data = await res.json();

        if (data.output && data.output.length > 0 && data.status === 'SUCCEEDED') {
        const videoUrl = data.output[0];
        window.open(videoUrl, '_blank');
        } else {
        alert('✅ Video generation task started. Please check back later.');
        }
    } catch (err) {
        console.error('Video generation failed:', err);
        alert('❌ Failed to generate video. Try again later.');
    } finally {
        setVideoLoading(prev => ({ ...prev, [image.listing_image_id]: false }));
    }
};

  return (
    <div>
      <h6 className="fw-bold mb-3">📸 Product Media: {product.title}</h6>

      {loading && <p className="text-muted">Loading images...</p>}
      {!loading && images.length === 0 && (
        <p className="text-muted">No images found for this listing.</p>
      )}

      <div className="row g-3">
        {images.map((img) => (
          <div className="col-6 col-md-4 col-lg-3" key={img.listing_image_id}>
            <div className="border rounded shadow-sm p-2 h-100 text-center bg-white">
              <img
                src={img.url_170x135}
                alt={img.alt_text || `Image ${img.rank}`}
                className="img-fluid rounded mb-2"
                style={{ objectFit: 'cover', width: '100%' }}
              />
              <small className="text-muted d-block mb-2">Rank: {img.rank}</small>

              <button
                className="btn btn-sm btn-warning mb-2 w-100"
                onClick={() => handleAnalyzeImage(img)}
              >
                🧠 Analyze Image
              </button>

              <button
                className="btn btn-sm btn-primary mb-2 ms-2"
                disabled={videoLoading[img.listing_image_id]}
                onClick={() => handleGenerateVideo(img)}
                >
                {videoLoading[img.listing_image_id] ? (
                    <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Generating...
                    </>
                ) : (
                    '🎞️ Generate Video'
                )}
                </button>

              {analysis[img.listing_image_id] && (
                <div className="alert alert-info text-start small">
                  {analysis[img.listing_image_id]}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductMediaTab;