import { ProductImageInterface, ProductVideoInterface } from '../../interfaces';

interface Props {
  media: (ProductImageInterface | ProductVideoInterface)[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

const isVideo = (media: ProductImageInterface | ProductVideoInterface): media is ProductVideoInterface => {
  return (media as ProductVideoInterface).video_url !== undefined;
};

const Carousel: React.FC<Props> = ({ media, currentIndex, onPrev, onNext }) => {
  const current = media[currentIndex];

  return (
    <div className="w-100 h-100 overflow-hidden position-relative rounded-4 shadow">
        {isVideo(current) ? (
            <video
            src={current.video_url}
            autoPlay
            loop
            muted
            className="w-100 h-100 object-fit-cover rounded-4"
            />
        ) : (
            <img
            src={current.url_fullxfull}
            alt="Product media"
            className="w-100 h-100 object-fit-cover rounded-4"
            />
        )}
        {/* botones si hay más de una imagen */}
        {media.length > 1 && (
            <>
            <button onClick={onPrev} className="carousel-control prev">‹</button>
            <button onClick={onNext} className="carousel-control next">›</button>
            </>
        )}
    </div>
  );
};

export default Carousel;