import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { ThemeKey } from '../types/Event';
import { createSceneForTheme, SHARED_BACKGROUND_CSS } from '../three/scenes';
import './ThreeScene.css';

interface ThreeSceneProps {
  themeKey: ThemeKey;
  accentColor: string;
}

function ThreeScene({ themeKey, accentColor }: ThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationIdRef = useRef<number>(0);
  const updateFnRef = useRef<((delta: number) => void) | null>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 30;
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      if (!renderer.capabilities.isWebGL2) {
        throw new Error('WebGL2 not supported');
      }
    } catch {
      console.warn('WebGL not supported, falling back to gradient');
      setWebGLSupported(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const sceneFactory = createSceneForTheme(themeKey, accentColor);
    updateFnRef.current = sceneFactory.setup(scene, camera);

    const clock = new THREE.Clock();

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (updateFnRef.current && !prefersReducedMotion) {
        updateFnRef.current(delta * 0.3);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationIdRef.current);

      if (rendererRef.current) {
        rendererRef.current.dispose();
        container.removeChild(rendererRef.current.domElement);
      }

      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((m) => m.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, [themeKey, accentColor]);

  if (!webGLSupported) {
    return (
      <div
        className="three-scene-container three-scene-fallback"
        style={{ background: SHARED_BACKGROUND_CSS }}
      />
    );
  }

  return <div ref={containerRef} className="three-scene-container" />;
}

export default ThreeScene;
