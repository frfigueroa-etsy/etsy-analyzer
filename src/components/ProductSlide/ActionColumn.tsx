import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faComment } from '@fortawesome/free-solid-svg-icons';

import SellerProfileButton from './SellerProfileButton'
import LikeButton from './LikeButton'

interface Props {
  likes: number;
  comments?: number;
  shopUrl?: string;
  profileImg?: string;
}

const ActionColumn: React.FC<Props> = ({ likes, comments = 0, shopUrl = "#", profileImg = ''}) => (
    
  <div 
      style={{
        position: 'absolute',
        top: '80%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
    }}>

    <div className="action-wrapper">
        <SellerProfileButton shopUrl={shopUrl} imageUrl={profileImg}/>
        <LikeButton likes={likes}/>
        <button className="action-icon-btn">
            <FontAwesomeIcon icon={faComment} size="2x"/>
        </button>
        <div className="action-label">{comments}</div>
        </div>

        <div className="action-wrapper">
        <button className="action-icon-btn">
            <FontAwesomeIcon icon={faShare} size="2x"/>
        </button>
    </div>

  </div>
);

export default ActionColumn;