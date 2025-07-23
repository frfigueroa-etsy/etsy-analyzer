import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faComment } from '@fortawesome/free-solid-svg-icons';

import SellerProfileButton from './SellerProfileButton';
import LikeButton from './LikeButton';
import ReviewDrawer from './ReviewDrawer'; // asegúrate de que la ruta sea correcta

interface Props {
  likes: number;
  shopUrl?: string;
  profileImg?: string;
  productId: number;
}

const ActionColumn: React.FC<Props> = ({
  likes,
  shopUrl = '#',
  profileImg = '',
  productId,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: '80%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div className="action-wrapper">
          <SellerProfileButton shopUrl={shopUrl} profileImg={profileImg} />
          <LikeButton likes={likes} />
          <button className="action-icon-btn" onClick={() => setDrawerOpen(true)}>
            <FontAwesomeIcon icon={faComment} size="2x" />
          </button>
          <button className="action-icon-btn">
            <FontAwesomeIcon icon={faShare} size="2x" />
          </button>
        </div>
      </div>

      <ReviewDrawer
        productId={productId}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default ActionColumn;