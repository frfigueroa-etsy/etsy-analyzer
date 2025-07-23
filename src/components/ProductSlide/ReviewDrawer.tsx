import { useEffect, useState } from 'react';
import './ProductSlide.css';
import { API_URL } from '../../configs/env';
import { ReviewInterface } from '../../interfaces/Review.interface'

interface Props {
  productId: number;
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString();
};

const ReviewDrawer: React.FC<Props> = ({ productId, isOpen, onClose }) => {
  const [reviews, setReviews] = useState<ReviewInterface[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/etsy/shopListing/reviews/listing/${productId}`);
        const data = await res.json();
        setReviews(data.results || []);
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, isOpen]);

  return (
    <div className={`review-drawer ${isOpen ? 'open' : ''}`}>
      <button className="btn btn-close close-btn" onClick={onClose} />
      <div className="review-drawer-content">
        <h5 className="mb-3">Reviews</h5>
        {loading ? (
          <p>Loading...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          reviews.map((r, index) => (
            <div key={index} className="mb-4 border-bottom pb-3">
              <div className="d-flex justify-content-between align-items-center">
                <strong>Rating: {r.rating} ⭐</strong>
                <small className="text-muted">{formatDate(r.create_timestamp)}</small>
              </div>
              <p className="mt-2">{r.review}</p>
              {r.image_url_fullxfull && (
                <img
                  src={r.image_url_fullxfull}
                  alt="Review"
                  className="img-fluid rounded"
                  style={{ maxHeight: '200px', objectFit: 'cover' }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewDrawer;