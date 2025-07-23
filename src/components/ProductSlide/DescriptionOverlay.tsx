import { useState } from 'react';

interface Props {
  title: string;
  price: number;
  description: string;
  productUrl?: string;
  tags?: string[];
}

const DescriptionOverlay: React.FC<Props> = ({ title, price, productUrl, description , tags = []}) => {
  const [expanded, setExpanded] = useState(false);
  const preview = description.slice(0, 100);
  const handleTagClick = async (tag: string) => {
    const cleanTag = tag.trim();
    if (!cleanTag) return;

    chrome.storage.local.get(['keyword'], (result) => {
        const current = (result.keyword || '').trim();

        const keywords = current
        .split(/\s+/) // divide por cualquier cantidad de espacios
        .filter(Boolean);

        const existingWordsSet = new Set(keywords.map((k:string) => k.toLowerCase()));
        const tagWords = cleanTag.split(/\s+/).filter(Boolean);

        const newWords = tagWords.filter(word => !existingWordsSet.has(word.toLowerCase()));

        if (newWords.length > 0) {
        const updated = [...keywords, ...newWords].join(' ');
        chrome.storage.local.set({ keyword: updated });
        }
    });
    };


  return (
    <div className="position-absolute bottom-0 w-100 text-white p-3 z-2 description-overlay">
      <h5 className="fw-bold">
        {productUrl
          ? ( <a
              href={productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >{title}</a>)
          : (<span>{title}</span>)
        }
      </h5>
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
                onClick={() => handleTagClick(tag)}
                style={{ animationDelay: `${idx * 100}ms` , cursor: 'pointer'}}
            >
                #{tag}
            </span>
        ))}

    </div>
  );
};

export default DescriptionOverlay;