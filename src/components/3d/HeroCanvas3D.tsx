import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface LandmarkPin {
  id: string;
  name: string;
  sub: string;
  x: number;
  y: number;
  z: number;
  color: string;
}

const PINS: LandmarkPin[] = [
  { id: 'seixas', name: 'Extremo Oriental das Américas', sub: 'Onde o sol nasce primeiro', x: 2.8, y: 0.8, z: -1.2, color: '#F4A261' },
  { id: 'tambau', name: 'Orla Marítima Central', sub: 'Piscinas Naturais & Calçadão', x: 0.5, y: 0.4, z: 0.5, color: '#00B4D8' },
  { id: 'jacare', name: 'Pôr do Sol no Rio', sub: 'O ritual emocionante do Saxofone', x: -2.4, y: 0.6, z: -2.0, color: '#E76F51' },
  { id: 'coqueirinho', name: 'Falésias da Costa do Sul', sub: 'Cânions & Enseadas de Mar Calmo', x: 3.5, y: 0.5, z: 2.2, color: '#2EC4B6' }
];

export const HeroCanvas3D: React.FC<{ onSelectPin?: (id: string) => void }> = ({ onSelectPin }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePin, setActivePin] = useState<LandmarkPin | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060b11, 0.08);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 3.2, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Iluminação
    const ambientLight = new THREE.AmbientLight(0x0a192f, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xf4a261, 2.5);
    sunLight.position.set(5, 6, -4);
    scene.add(sunLight);

    const cyanLight = new THREE.PointLight(0x00b4d8, 3, 20);
    cyanLight.position.set(-4, 2, 2);
    scene.add(cyanLight);

    // 1. Superfície Oceânica Ondulante
    const waveGeometry = new THREE.PlaneGeometry(24, 24, 64, 64);
    waveGeometry.rotateX(-Math.PI / 2);
    
    // Guardar posições originais para ondas procedurais
    const positionAttribute = waveGeometry.attributes.position;
    const initialPositions = positionAttribute.array.slice();

    const waveMaterial = new THREE.MeshStandardMaterial({
      color: 0x002b47,
      roughness: 0.25,
      metalness: 0.8,
      flatShading: true,
      wireframe: false
    });

    const oceanMesh = new THREE.Mesh(waveGeometry, waveMaterial);
    oceanMesh.position.y = -0.5;
    scene.add(oceanMesh);

    // Grade sutil wireframe flutuando sobre a água
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x00b4d8,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    const gridMesh = new THREE.Mesh(waveGeometry, gridMaterial);
    gridMesh.position.y = -0.48;
    scene.add(gridMesh);

    // 2. Marcadores 3D dos Pontos Turísticos
    const pinGroup = new THREE.Group();
    const pinMeshes: { mesh: THREE.Group; data: LandmarkPin }[] = [];

    PINS.forEach((pin) => {
      const pinObj = new THREE.Group();
      pinObj.position.set(pin.x, pin.y, pin.z);

      // Haste de luz brilhante
      const stemGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8);
      const stemMat = new THREE.MeshBasicMaterial({ color: pin.color, transparent: true, opacity: 0.85 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = 0.6;
      pinObj.add(stem);

      // Esfera de topo brilhante
      const headGeo = new THREE.SphereGeometry(0.16, 16, 16);
      const headMat = new THREE.MeshStandardMaterial({
        color: pin.color,
        emissive: pin.color,
        emissiveIntensity: 0.9,
        roughness: 0.2
      });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 1.2;
      pinObj.add(head);

      // Anel de pulso
      const ringGeo = new THREE.RingGeometry(0.2, 0.35, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: pin.color,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 0.05;
      pinObj.add(ring);

      pinGroup.add(pinObj);
      pinMeshes.push({ mesh: pinObj, data: pin });
    });
    scene.add(pinGroup);

    // 3. Campo de Partículas de Luz Solar
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cGold = new THREE.Color(0xf4a261);
    const cCyan = new THREE.Color(0x00b4d8);

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 16;
      particlePos[i * 3 + 1] = Math.random() * 6;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 14;

      const chosenColor = Math.random() > 0.5 ? cGold : cCyan;
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Interatividade com Mouse e Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 3.2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
      targetCameraX = x * 1.5;
      targetCameraY = 3.2 + y * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Loop de Animação Otimizado
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });

    observer.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const time = clock.getElapsedTime();

      // Suavização do movimento da câmera (lerp)
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(0, 0.4, 0);

      // Animação das Ondas Oceânicas (Simulação do Mar de Jampa)
      const positions = waveGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const u = initialPositions[i];
        const w = initialPositions[i + 2];
        positions[i + 1] =
          Math.sin(u * 0.8 + time * 1.5) * 0.18 +
          Math.cos(w * 0.8 + time * 1.2) * 0.15 +
          Math.sin((u + w) * 0.4 + time * 0.8) * 0.1;
      }
      waveGeometry.attributes.position.needsUpdate = true;

      // Animação de pulsação e flutuação dos marcadores
      pinMeshes.forEach((item, index) => {
        const ring = item.mesh.children[2] as THREE.Mesh;
        if (ring) {
          const scale = 1 + Math.sin(time * 3 + index) * 0.3;
          ring.scale.set(scale, scale, scale);
        }
        item.mesh.position.y = item.data.y + Math.sin(time * 2 + index * 1.5) * 0.08;
      });

      // Flutuação das partículas
      particles.rotation.y = time * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // Redimensionamento responsivo
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="hero-3d-wrapper" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Pins Interativos HTML Sobrepostos para Clicar */}
      <div className="pins-interactive-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}>
        {PINS.map((pin) => (
          <button
            key={pin.id}
            onClick={() => {
              setActivePin(pin);
              onSelectPin?.(pin.id);
            }}
            className="pin-bubble"
            aria-label={`Ver informações de ${pin.name}`}
            style={{
              position: 'absolute',
              cursor: 'pointer',
              ...(pin.id === 'tambau' ? { top: '55%', left: '50%', transform: 'translate(-50%, -50%)' } : {}),
              ...(pin.id === 'seixas' ? { top: '48%', right: '18%' } : {}),
              ...(pin.id === 'jacare' ? { top: '38%', left: '16%' } : {}),
              ...(pin.id === 'coqueirinho' ? { bottom: '22%', right: '28%' } : {})
            }}
          >
            <div className="pin-indicator">
              <span className="pin-pulse" style={{ backgroundColor: pin.color }} />
              <span className="pin-dot" style={{ backgroundColor: pin.color }} />
            </div>
            <div className="pin-tooltip">
              <span className="pin-title">{pin.name}</span>
              <span className="pin-sub">{pin.sub}</span>
            </div>
          </button>
        ))}
      </div>

      <style>{`
        .hero-3d-wrapper {
          z-index: 1;
        }
        .pin-bubble {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(6, 11, 17, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 6px 14px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all 0.25s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }
        .pin-bubble:hover {
          transform: translateY(-3px) scale(1.05);
          border-color: #00B4D8;
          background: rgba(12, 20, 31, 0.95);
          box-shadow: 0 0 25px rgba(0, 180, 216, 0.4);
        }
        .pin-indicator {
          position: relative;
          width: 10px;
          height: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pin-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .pin-pulse {
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          opacity: 0.6;
          animation: pulsePin 2s infinite ease-out;
        }
        @keyframes pulsePin {
          0% { transform: scale(0.5); opacity: 0.9; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .pin-tooltip {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .pin-title {
          font-family: var(--font-display);
          font-size: 0.8125rem;
          font-weight: 700;
          color: #F8FAFC;
          line-height: 1.2;
        }
        .pin-sub {
          font-size: 0.6875rem;
          color: #94A3B8;
        }
        @media (max-width: 768px) {
          .pin-bubble {
            padding: 4px 10px;
          }
          .pin-sub {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
