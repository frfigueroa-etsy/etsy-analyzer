import { useState } from 'react';

interface Props {
  title: string;
  price: number;
  description: string;
  tags?: string[];
}

const DescriptionOverlay: React.FC<Props> = ({ title, price, description , tags = []}) => {
  const [expanded, setExpanded] = useState(false);
  const preview = description.slice(0, 100);

  return (
    <div className="position-absolute bottom-0 w-100 text-white p-3 z-2 description-overlay">
      <h5 className="fw-bold">{title}</h5>
      <p className="mb-1">💰 ${price.toFixed(2)} USD</p>
      <p className="small">
        {expanded ? description : preview}
        {description.length > 100 && (
          <span className="ms-2 text-info" style={{ cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
            {expanded ? 'View Less' : 'View More'}
          </span>
        )}
      </p>
      {tags.map((tag, idx) => (
            <span
                key={idx}
                className="badge tag-badge animate-tag mx-1"
                style={{ animationDelay: `${idx * 100}ms` }}
            >
                #{tag}
            </span>
        ))}

    </div>
  );
};

export default DescriptionOverlay;