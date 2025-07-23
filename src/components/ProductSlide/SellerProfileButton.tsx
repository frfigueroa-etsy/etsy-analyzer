import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faShop } from '@fortawesome/free-solid-svg-icons';

interface SellerProfileButtonProps {
  shopUrl: string;
  imageUrl: string;
}

const SellerProfileButton: React.FC<SellerProfileButtonProps> = ({ shopUrl, imageUrl }) => {
  return (
    <a
      href={shopUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="position-relative d-inline-block seller-profile-btn my-4"
    >
        { 
            imageUrl 
            ? ( <img src={imageUrl} alt="Seller" className="seller-profile-img" />)
            : (<div className="action-icon-btn">
                    <FontAwesomeIcon icon={faShop} size="2x"/>
                </div>)
        }
      <div className="plus-badge">
        <FontAwesomeIcon icon={faPlus} size="2x"/>
      </div>
    </a>
  );
};

export default SellerProfileButton;