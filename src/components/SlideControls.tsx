import './SlideControls.css';

interface SlideControlsProps {
  currentIndex: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
}

function SlideControls({
  currentIndex,
  totalSlides,
  onNext,
  onPrev,
}: SlideControlsProps) {
  return (
    <div className="slide-controls">
      <button
        className="slide-control-btn prev"
        onClick={onPrev}
        aria-label="Previous slide"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className="slide-indicator">
        {currentIndex + 1} / {totalSlides}
      </div>

      <button
        className="slide-control-btn next"
        onClick={onNext}
        aria-label="Next slide"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

export default SlideControls;
