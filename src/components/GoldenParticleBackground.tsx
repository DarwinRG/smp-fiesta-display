import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import './GoldenParticleBackground.css';

const PARTICLE_COUNT = 100;
const GOLDEN_COLORS = [
  'rgba(201, 162, 39, 0.45)',
  'rgba(184, 134, 11, 0.4)',
  'rgba(178, 119, 70, 0.35)',
  'rgba(160, 128, 96, 0.4)',
  'rgba(218, 165, 32, 0.35)',
  'rgba(139, 115, 85, 0.4)',
];

function GoldenParticleBackground() {
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const u = Math.random();
      const v = Math.random();
      const top = v * 100;
      const left = u * 100;
      const sizeBase = 1 - v;
      const width = 2 + sizeBase * 4 + Math.random() * 3;
      const height = Math.max(0.8, width * (0.3 + Math.random() * 0.6));
      const color = GOLDEN_COLORS[Math.floor(Math.random() * GOLDEN_COLORS.length)];
      const rotation = (Math.random() - 0.5) * 180;
      const duration = 8 + Math.random() * 12;
      const delay = Math.random() * 5;
      return {
        key: i,
        top,
        left,
        width,
        height,
        color,
        rotation,
        duration,
        delay,
      };
    });
  }, []);

  return (
    <div className="golden-particle-background" aria-hidden>
      {particles.map((p) => (
        <div
          key={p.key}
          className="golden-particle"
          style={{
            '--r': `${p.rotation}deg`,
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.width}px`,
            height: `${p.height}px`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

export default GoldenParticleBackground;
