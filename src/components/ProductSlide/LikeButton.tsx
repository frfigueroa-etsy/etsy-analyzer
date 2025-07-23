import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const LikeButton = ({ likes = 0 }) => {
  const [liked, setLiked] = useState(false);
  const [animate, setAnimate] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 400); // Duración de la animación
  };

  return (
    <div className="action-wrapper">
      <button
        className={`action-icon-btn like-btn ${liked ? 'liked' : ''} ${animate ? 'bounce' : ''}`}
        onClick={toggleLike}
      >
        <FontAwesomeIcon icon={faHeart} size="2x"/>
      </button>
      <div className="action-label">{likes}</div>
    </div>
  );
};

export default LikeButton;