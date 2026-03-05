import type { CSSProperties } from 'react';
import type { FiestaEvent } from '../types/Event';
import GoldenParticleBackground from './GoldenParticleBackground';
import ThreeScene from './ThreeScene';
import './EventSlide.css';

interface EventSlideProps {
  event: FiestaEvent;
}

function EventSlide({ event }: EventSlideProps) {
  return (
    <div className="event-slide">
      <ThreeScene themeKey={event.themeKey} accentColor={event.accentColor} />
      <GoldenParticleBackground />
      <div className="event-slide-overlay" />

      <div className="event-slide-content">
        <div className="event-logo-wrapper">
          <div className="event-logo-ring">
            <img
              src="/logo.png"
              alt="San Manuel Town Fiesta 2026 logo"
              className="event-logo-image"
            />
          </div>
        </div>

        {event.subtitle && (
          <p className="event-subtitle">{event.subtitle}</p>
        )}

        <h1 className="event-title">{event.title}</h1>

        <div className="event-datetime">
          <span className="event-date">{event.date}</span>
          <span className="event-time-separator">|</span>
          <span className="event-time">{event.time}</span>
        </div>
      </div>

      <div
        className="event-accent-glow"
        style={{ '--accent-color': event.accentColor } as CSSProperties}
      />
    </div>
  );
}

export default EventSlide;
