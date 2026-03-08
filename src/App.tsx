import { useState, useEffect, useCallback } from 'react';
import { EVENTS } from './data/events';
import EventSlide from './components/EventSlide';
import SlideControls from './components/SlideControls';
import './App.css';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentEvent = EVENTS[currentIndex];

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % EVENTS.length);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + EVENTS.length) % EVENTS.length);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          e.preventDefault();
          goToNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrev();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  useEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / 1920;
      const scaleY = window.innerHeight / 1080;
      const scale = Math.min(scaleX, scaleY);
      document.documentElement.style.setProperty('--app-scale', scale.toString());
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app-container">
      <EventSlide key={currentEvent.id} event={currentEvent} />
      <SlideControls
        currentIndex={currentIndex}
        totalSlides={EVENTS.length}
        onNext={goToNext}
        onPrev={goToPrev}
      />
    </div>
  );
}

export default App;
