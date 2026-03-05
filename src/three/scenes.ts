import * as THREE from 'three';
import type { ThemeKey } from '../types/Event';

/** Single background for all event slides (3D and fallback). Matches --color-background in index.css. */
export const SHARED_BACKGROUND_HEX = 0x0a0a0f;
export const SHARED_BACKGROUND_CSS = '#0a0a0f';

export interface SceneFactory {
  setup: (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => (delta: number) => void;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
}

export function getThemeColors(themeKey: ThemeKey): ThemeColors {
  switch (themeKey) {
    case 'thanksgiving_night':
      return { primary: '#1a0f05', secondary: '#3d2817' };
    case 'farmers_night':
      return { primary: '#0d1f0d', secondary: '#1a3a1a' };
    case 'senior_citizens_day':
      return { primary: '#1a1025', secondary: '#2d1a3d' };
    case 'bingo_bonanza':
      return { primary: '#0f0a1a', secondary: '#1a0f2d' };
    case 'coronation_night':
      return { primary: '#0a0510', secondary: '#1a0f20' };
    case 'binibining_san_manuel':
      return { primary: '#150818', secondary: '#2d1030' };
    case 'balligi_night':
      return { primary: '#050a14', secondary: '#0a1428' };
    default:
      return { primary: '#0a0a0f', secondary: '#1a1a2f' };
  }
}

function createThanksgivingScene(accentColor: string): SceneFactory {
  return {
    setup: (scene, camera) => {
      scene.background = new THREE.Color(SHARED_BACKGROUND_HEX);
      scene.fog = new THREE.Fog(SHARED_BACKGROUND_HEX, 20, 80);

      const ambientLight = new THREE.AmbientLight(0xffa500, 0.3);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(accentColor, 1, 100);
      pointLight.position.set(10, 10, 10);
      scene.add(pointLight);

      const leaves: THREE.Mesh[] = [];
      const leafGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.5);

      for (let i = 0; i < 70; i++) {
        const hue = 0.08 + Math.random() * 0.05;
        const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
        const material = new THREE.MeshPhongMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.2,
        });
        const leaf = new THREE.Mesh(leafGeometry, material);
        leaf.position.set(
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 30 - 10
        );
        leaf.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        leaf.userData.rotSpeed = {
          x: (Math.random() - 0.5) * 0.5,
          y: (Math.random() - 0.5) * 0.5,
          z: (Math.random() - 0.5) * 0.3,
        };
        leaf.userData.floatSpeed = 0.3 + Math.random() * 0.3;
        leaf.userData.floatOffset = Math.random() * Math.PI * 2;
        leaves.push(leaf);
        scene.add(leaf);
      }

      const embers: THREE.Mesh[] = [];
      const emberGeometry = new THREE.SphereGeometry(0.18, 12, 12);
      for (let i = 0; i < 30; i++) {
        const emberColor = new THREE.Color(accentColor).offsetHSL(
          (Math.random() - 0.5) * 0.05,
          0,
          (Math.random() - 0.5) * 0.1,
        );
        const emberMaterial = new THREE.MeshBasicMaterial({
          color: emberColor,
        });
        const ember = new THREE.Mesh(emberGeometry, emberMaterial);
        ember.position.set(
          (Math.random() - 0.5) * 40,
          -10 - Math.random() * 10,
          (Math.random() - 0.5) * 20 - 10,
        );
        ember.userData.speed = 2 + Math.random() * 2;
        embers.push(ember);
        scene.add(ember);
      }

      let time = 0;
      return (delta: number) => {
        time += delta;
        leaves.forEach((leaf) => {
          leaf.rotation.x += leaf.userData.rotSpeed.x * delta;
          leaf.rotation.y += leaf.userData.rotSpeed.y * delta;
          leaf.rotation.z += leaf.userData.rotSpeed.z * delta;
          leaf.position.y += Math.sin(time * leaf.userData.floatSpeed + leaf.userData.floatOffset) * 0.02;
        });
         embers.forEach((ember) => {
          ember.position.y += ember.userData.speed * delta;
          ember.position.x += Math.sin(time * 2 + ember.position.z) * 0.02;
          if (ember.position.y > 15) {
            ember.position.y = -12 - Math.random() * 6;
          }
        });
        camera.position.x = Math.sin(time * 0.1) * 2;
        camera.position.y = Math.cos(time * 0.08) * 1.5;
        camera.lookAt(0, 0, -10);
      };
    },
  };
}

function createFarmersScene(accentColor: string): SceneFactory {
  return {
    setup: (scene, camera) => {
      scene.background = new THREE.Color(SHARED_BACKGROUND_HEX);
      scene.fog = new THREE.Fog(SHARED_BACKGROUND_HEX, 30, 100);

      const ambientLight = new THREE.AmbientLight(new THREE.Color(accentColor), 0.4);
      scene.add(ambientLight);

      const sunLight = new THREE.DirectionalLight(0xffd700, 0.8);
      sunLight.position.set(20, 30, 10);
      scene.add(sunLight);

      // Grass clumps at the bottom of the view (foreground, on the ground)
      const clumps: THREE.Mesh[] = [];
      const bladeGeometry = new THREE.ConeGeometry(0.18, 0.9, 6);
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 14; col++) {
          const centerX = (col - 7) * 3.2 + (Math.random() - 0.5) * 0.8;
          const centerZ = (row - 4) * 2 + 10;

          const bladesInClump = 3 + Math.floor(Math.random() * 3);
          for (let i = 0; i < bladesInClump; i++) {
            const hue = 0.28 + Math.random() * 0.05;
            const material = new THREE.MeshPhongMaterial({
              color: new THREE.Color().setHSL(hue, 0.85, 0.38 + Math.random() * 0.12),
            });
            const blade = new THREE.Mesh(bladeGeometry, material);
            blade.position.set(
              centerX + (Math.random() - 0.5) * 0.8,
              -0.75,
              centerZ + (Math.random() - 0.5) * 0.8,
            );
            blade.rotation.z = (Math.random() - 0.5) * 0.6;
            blade.userData.swaySpeed = 0.5 + Math.random() * 0.7;
            blade.userData.swayOffset = Math.random() * Math.PI * 2;
            clumps.push(blade);
            scene.add(blade);
          }
        }
      }

      // Water droplets drifting over the fields
      const droplets: THREE.Mesh[] = [];
      const dropletGeometry = new THREE.SphereGeometry(0.18, 10, 10);
      for (let i = 0; i < 80; i++) {
        const mat = new THREE.MeshPhongMaterial({
          color: 0x7dd3fc,
          transparent: true,
          opacity: 0.9,
          shininess: 90,
        });
        const drop = new THREE.Mesh(dropletGeometry, mat);
        drop.position.set(
          (Math.random() - 0.5) * 40,
          0.5 + Math.random() * 4,
          -18 + (Math.random() - 0.5) * 20,
        );
        drop.userData.baseY = drop.position.y;
        drop.userData.floatSpeed = 0.6 + Math.random() * 0.8;
        drop.userData.floatOffset = Math.random() * Math.PI * 2;
        droplets.push(drop);
        scene.add(drop);
      }

      const groundGeometry = new THREE.PlaneGeometry(100, 100);
      const groundMaterial = new THREE.MeshPhongMaterial({
        color: 0x3d2817,
        side: THREE.DoubleSide,
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.75;
      scene.add(ground);

      camera.position.set(0, 6, 26);
      camera.lookAt(0, 0, -10);

      let time = 0;
      return (delta: number) => {
        time += delta;
        clumps.forEach((blade) => {
          blade.rotation.z =
            Math.sin(time * blade.userData.swaySpeed + blade.userData.swayOffset) * 0.25;
        });
        droplets.forEach((drop) => {
          drop.position.y =
            drop.userData.baseY +
            Math.sin(time * drop.userData.floatSpeed + drop.userData.floatOffset) * 0.5;
          drop.position.x += Math.sin(time * 0.3 + drop.userData.floatOffset) * 0.01;
        });
      };
    },
  };
}

function createSeniorCitizensScene(accentColor: string): SceneFactory {
  return {
    setup: (scene, camera) => {
      scene.background = new THREE.Color(SHARED_BACKGROUND_HEX);
      scene.fog = new THREE.Fog(SHARED_BACKGROUND_HEX, 20, 70);

      const ambientLight = new THREE.AmbientLight(0xdda0dd, 0.3);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(accentColor, 1, 80);
      pointLight.position.set(0, 20, 10);
      scene.add(pointLight);

      const balloons: THREE.Mesh[] = [];
      const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);

      const pastelColors = [0xffb6c1, 0xdda0dd, 0xb0e0e6, 0x98fb98, 0xffdab9, 0xe6e6fa];

      for (let i = 0; i < 40; i++) {
        const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
        const material = new THREE.MeshPhongMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.15,
          transparent: true,
          opacity: 0.85,
        });
        const balloon = new THREE.Mesh(sphereGeometry, material);
        balloon.scale.setScalar(0.5 + Math.random() * 0.8);
        balloon.position.set(
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20 - 15
        );
        balloon.userData.riseSpeed = 0.5 + Math.random() * 0.5;
        balloon.userData.wobbleOffset = Math.random() * Math.PI * 2;
        balloon.userData.startY = balloon.position.y;
        balloons.push(balloon);
        scene.add(balloon);
      }

      const confettiPieces: THREE.Mesh[] = [];
      const confettiGeometry = new THREE.BoxGeometry(0.18, 0.02, 0.3);
      for (let i = 0; i < 80; i++) {
        const hue = 0.8 + Math.random() * 0.2;
        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color().setHSL(hue, 0.7, 0.7),
          shininess: 60,
        });
        const piece = new THREE.Mesh(confettiGeometry, material);
        piece.position.set(
          (Math.random() - 0.5) * 40,
          15 + Math.random() * 20,
          (Math.random() - 0.5) * 25 - 15,
        );
        piece.userData.speed = 3 + Math.random() * 2;
        piece.userData.spin = 1 + Math.random() * 2;
        confettiPieces.push(piece);
        scene.add(piece);
      }

      let time = 0;
      return (delta: number) => {
        time += delta;
        balloons.forEach((balloon) => {
          balloon.position.y = balloon.userData.startY + Math.sin(time * balloon.userData.riseSpeed) * 3;
          balloon.position.x += Math.sin(time * 0.3 + balloon.userData.wobbleOffset) * 0.01;
        });
        confettiPieces.forEach((piece) => {
          piece.position.y -= piece.userData.speed * delta;
          piece.rotation.x += piece.userData.spin * delta;
          piece.rotation.z += piece.userData.spin * 0.7 * delta;
          if (piece.position.y < -20) {
            piece.position.y = 20 + Math.random() * 10;
            piece.position.x = (Math.random() - 0.5) * 40;
          }
        });
        camera.position.x = Math.sin(time * 0.05) * 3;
        camera.lookAt(0, 0, -10);
      };
    },
  };
}

function createBingoBonanzaScene(accentColor: string): SceneFactory {
  return {
    setup: (scene, camera) => {
      scene.background = new THREE.Color(SHARED_BACKGROUND_HEX);
      scene.fog = new THREE.Fog(SHARED_BACKGROUND_HEX, 25, 80);

      const ambientLight = new THREE.AmbientLight(new THREE.Color(accentColor), 0.3);
      scene.add(ambientLight);

      const spotLight = new THREE.SpotLight(0xffffff, 1);
      spotLight.position.set(0, 30, 20);
      spotLight.angle = Math.PI / 4;
      scene.add(spotLight);

      const balls: THREE.Mesh[] = [];
      const sphereGeometry = new THREE.SphereGeometry(1.2, 24, 24);
      const bingoColors = [0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff, 0x44ffff];
      const ballCount = 40;

      for (let i = 0; i < ballCount; i++) {
        const color = bingoColors[Math.floor(Math.random() * bingoColors.length)];
        const material = new THREE.MeshPhongMaterial({
          color,
          shininess: 100,
          specular: 0xffffff,
        });

        const ball = new THREE.Mesh(sphereGeometry, material);

        const baseX = -45 + (i / (ballCount - 1)) * 90 + (Math.random() - 0.5) * 6;
        const baseZ = -22 + (Math.random() - 0.5) * 10;
        const baseY = -2 + Math.random() * 6;

        ball.position.set(baseX, baseY, baseZ);

        ball.userData.baseX = baseX;
        ball.userData.baseY = baseY;
        ball.userData.baseZ = baseZ;
        ball.userData.bounceSpeed = 1 + Math.random() * 1.8;
        ball.userData.bounceOffset = Math.random() * Math.PI * 2;
        ball.userData.swaySpeed = 0.25 + Math.random() * 0.25;
        ball.userData.swayOffset = Math.random() * Math.PI * 2;

        balls.push(ball);
        scene.add(ball);
      }

      let time = 0;
      return (delta: number) => {
        time += delta;

        balls.forEach((ball) => {
          ball.rotation.x += delta * 0.5;
          ball.rotation.y += delta * 0.3;

          const swayPhase = time * ball.userData.swaySpeed + ball.userData.swayOffset;
          ball.position.x = ball.userData.baseX + Math.sin(swayPhase) * 2.5;
          ball.position.z = ball.userData.baseZ + Math.cos(swayPhase * 0.7) * 2;

          ball.position.y =
            ball.userData.baseY +
            Math.abs(
              Math.sin(time * ball.userData.bounceSpeed + ball.userData.bounceOffset),
            ) *
              2.4;
        });

        camera.position.x = Math.sin(time * 0.15) * 5;
        camera.position.y = Math.cos(time * 0.1) * 3;
        camera.lookAt(0, 0, -10);
      };
    },
  };
}

function createCoronationScene(accentColor: string): SceneFactory {
  return {
    setup: (scene, camera) => {
      scene.background = new THREE.Color(SHARED_BACKGROUND_HEX);
      scene.fog = new THREE.Fog(SHARED_BACKGROUND_HEX, 30, 90);

      const ambientLight = new THREE.AmbientLight(new THREE.Color(accentColor), 0.3);
      scene.add(ambientLight);

      // Confetti field (full width)
      const confettiPieces: THREE.Mesh[] = [];
      const confettiGeometry = new THREE.BoxGeometry(0.18, 0.02, 0.3);
      for (let i = 0; i < 120; i++) {
        const hue = 0.1 + Math.random() * 0.15;
        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color().setHSL(hue, 0.8, 0.7),
          shininess: 80,
        });
        const piece = new THREE.Mesh(confettiGeometry, material);
        piece.position.set(
          (Math.random() - 0.5) * 80,
          12 + Math.random() * 10,
          -14 + (Math.random() - 0.5) * 6,
        );
        piece.userData.speed = 4 + Math.random() * 2;
        piece.userData.spin = 1.2 + Math.random() * 1.2;
        confettiPieces.push(piece);
        scene.add(piece);
      }

      let time = 0;
      return (delta: number) => {
        time += delta;
        confettiPieces.forEach((piece) => {
          piece.position.y -= piece.userData.speed * delta;
          piece.rotation.x += piece.userData.spin * delta;
          piece.rotation.z += piece.userData.spin * 0.7 * delta;
          if (piece.position.y < -4) {
            piece.position.y = 14 + Math.random() * 4;
            piece.position.x = (Math.random() - 0.5) * 80;
          }
        });
        camera.position.x = Math.sin(time * 0.06) * 3.5;
        camera.position.y = 4.5 + Math.cos(time * 0.05) * 1.4;
        camera.lookAt(0, 0, -16);
      };
    },
  };
}

function createBinibiningScene(accentColor: string): SceneFactory {
  return {
    setup: (scene, camera) => {
      scene.background = new THREE.Color(SHARED_BACKGROUND_HEX);
      scene.fog = new THREE.Fog(SHARED_BACKGROUND_HEX, 25, 85);

      const ambientLight = new THREE.AmbientLight(new THREE.Color(accentColor), 0.25);
      scene.add(ambientLight);

      const starGeometry = new THREE.OctahedronGeometry(0.3);
      const stars: THREE.Mesh[] = [];
      for (let i = 0; i < 70; i++) {
        const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.set(
          (Math.random() - 0.5) * 80,
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 30 - 25
        );
        star.userData.twinkleSpeed = 1 + Math.random() * 2;
        star.userData.twinkleOffset = Math.random() * Math.PI * 2;
        star.userData.basePos = star.position.clone();
        stars.push(star);
        scene.add(star);
      }

      const sparkleGeometry = new THREE.SphereGeometry(0.12, 10, 10);
      const sparkles: THREE.Mesh[] = [];
      for (let i = 0; i < 40; i++) {
        const mat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.7,
        });
        const s = new THREE.Mesh(sparkleGeometry, mat);
        s.position.set(
          (Math.random() - 0.5) * 30,
          -2 + Math.random() * 10,
          -15 + (Math.random() - 0.5) * 6,
        );
        s.userData.pulseSpeed = 1.5 + Math.random();
        s.userData.pulseOffset = Math.random() * Math.PI * 2;
        s.userData.basePos = s.position.clone();
        sparkles.push(s);
        scene.add(s);
      }

      let time = 0;
      return (delta: number) => {
        time += delta;
        stars.forEach((star) => {
          const twinkle =
            0.5 + Math.sin(time * star.userData.twinkleSpeed + star.userData.twinkleOffset) * 0.5;
          star.scale.setScalar(twinkle);

          const base = star.userData.basePos as THREE.Vector3;
          const driftX =
            Math.sin(time * 0.08 + star.userData.twinkleOffset) * 0.6;
          const driftY =
            Math.cos(time * 0.06 + star.userData.twinkleOffset) * 0.6;
          star.position.x = base.x + driftX;
          star.position.y = base.y + driftY;
        });

        sparkles.forEach((s) => {
          const material = s.material as THREE.MeshBasicMaterial;
          const pulse =
            0.3 + Math.abs(Math.sin(time * s.userData.pulseSpeed + s.userData.pulseOffset));
          material.opacity = pulse;

          const base = s.userData.basePos as THREE.Vector3;
          s.position.y =
            base.y +
            Math.sin(time * s.userData.pulseSpeed + s.userData.pulseOffset) * 0.6;
        });

        camera.position.x = Math.sin(time * 0.04) * 4;
        camera.position.y = 2.8 + Math.cos(time * 0.035) * 1.4;
        camera.lookAt(0, 0, -15);
      };
    },
  };
}

function createBalligiScene(accentColor: string): SceneFactory {
  return {
    setup: (scene, camera) => {
      scene.background = new THREE.Color(SHARED_BACKGROUND_HEX);
      scene.fog = new THREE.Fog(SHARED_BACKGROUND_HEX, 20, 70);

      const ambientLight = new THREE.AmbientLight(new THREE.Color(accentColor), 0.35);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
      keyLight.position.set(-10, 18, 12);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(new THREE.Color(accentColor), 0.6);
      fillLight.position.set(14, 12, 8);
      scene.add(fillLight);

      // Soft starfield and bouncing balls for a grand finale
      const starGeometry = new THREE.OctahedronGeometry(0.3);
      const stars: THREE.Mesh[] = [];
      for (let i = 0; i < 90; i++) {
        const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const star = new THREE.Mesh(starGeometry, mat);
        star.position.set(
          (Math.random() - 0.5) * 70,
          (Math.random() - 0.5) * 45,
          (Math.random() - 0.5) * 30 - 25,
        );
        star.userData.twinkleSpeed = 0.8 + Math.random() * 1.5;
        star.userData.twinkleOffset = Math.random() * Math.PI * 2;
        star.userData.basePos = star.position.clone();
        stars.push(star);
        scene.add(star);
      }

      const floorGeometry = new THREE.CircleGeometry(18, 64);
      const floorMaterial = new THREE.MeshPhongMaterial({
        color: 0x020617,
        emissive: new THREE.Color(accentColor),
        emissiveIntensity: 0.18,
        shininess: 120,
      });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(0, -4, -18);
      scene.add(floor);

      const beamGeometry = new THREE.CylinderGeometry(0.25, 1.2, 26, 20, 1, true);
      const beamMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(accentColor),
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
      });
      const beams: THREE.Mesh[] = [];
      for (let i = 0; i < 4; i++) {
        const b = new THREE.Mesh(beamGeometry, beamMaterial);
        b.position.set((i - 1.5) * 6, 9, -19);
        beams.push(b);
        scene.add(b);
      }

      let time = 0;
      return (delta: number) => {
        time += delta;

        stars.forEach((star) => {
          const twinkle =
            0.5 + Math.sin(time * star.userData.twinkleSpeed + star.userData.twinkleOffset) * 0.5;
          star.scale.setScalar(twinkle);
          const base = star.userData.basePos as THREE.Vector3;
          star.position.x =
            base.x + Math.sin(time * 0.06 + star.userData.twinkleOffset) * 0.5;
        });

        beams.forEach((b, index) => {
          const material = b.material as THREE.MeshBasicMaterial;
          material.opacity =
            0.12 + Math.abs(Math.sin(time * 0.7 + index * 0.8)) * 0.18;
        });

        camera.position.x = Math.sin(time * 0.1) * 4;
        camera.position.y = 3.6 + Math.cos(time * 0.08) * 1.3;
        camera.lookAt(0, -1, -18);
      };
    },
  };
}

export function createSceneForTheme(themeKey: ThemeKey, accentColor: string): SceneFactory {
  switch (themeKey) {
    case 'thanksgiving_night':
      return createThanksgivingScene(accentColor);
    case 'farmers_night':
      return createFarmersScene(accentColor);
    case 'senior_citizens_day':
      return createSeniorCitizensScene(accentColor);
    case 'bingo_bonanza':
      return createBingoBonanzaScene(accentColor);
    case 'coronation_night':
      return createCoronationScene(accentColor);
    case 'binibining_san_manuel':
      return createBinibiningScene(accentColor);
    case 'balligi_night':
      return createBalligiScene(accentColor);
    default:
      return createThanksgivingScene(accentColor);
  }
}
