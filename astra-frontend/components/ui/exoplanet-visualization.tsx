"use client";

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';

const VISUAL_SCALE = 0.2;
const PLANET_SCALE = 0.05;
const ORBIT_SCALE = 2.5;

interface VisualizationData {
  st_rad: number;      // Stellar Radius [R_Sun]
  st_tmag: number;     // TESS Magnitude
  pl_rade: number;     // Planet Radius [R_Earth]
  pl_orbper: number;   // Planet Orbital Period [days]
  st_teff?: number;    // Stellar Temperature [K] - optional for color
}

interface StarProps {
  stellarRadius: number;
  tmag: number;
  temperature?: number;
}

// --- Star Component ---
function Star({ stellarRadius, tmag, temperature = 5778 }: StarProps) {
  const starRef = useRef<THREE.Mesh>(null);
  const baseIntensity = Math.max(0.2, (18 - tmag) / 8);

  // Calculate star color based on temperature
  const getStarColor = (temp: number) => {
    if (temp < 3700) return '#ff6b4a'; // Red dwarf
    if (temp < 5200) return '#ffd480'; // Orange dwarf
    if (temp < 6000) return '#fff4d5'; // Yellow dwarf (Sun-like)
    if (temp < 7500) return '#ffffff'; // White
    if (temp < 10000) return '#c6d8ff'; // Blue-white
    return '#aabfff'; // Blue
  };

  const starColor = getStarColor(temperature);

  useFrame(({ clock }) => {
    const pulse = 1 + 0.05 * Math.sin(clock.getElapsedTime() * 0.5);
    if (starRef.current) {
      starRef.current.scale.setScalar(stellarRadius);
      starRef.current.material.emissiveIntensity = baseIntensity * 0.5 * pulse;
    }
  });

  return (
    <>
      <mesh ref={starRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color={starColor}
          emissive={starColor}
          emissiveIntensity={baseIntensity * 0.5}
        />
      </mesh>
      <mesh scale={[stellarRadius, stellarRadius, stellarRadius]}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshBasicMaterial
          color={starColor}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <pointLight
        position={[0, 0, 0]}
        intensity={baseIntensity * 2}
        color={starColor}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.1}
        shadow-camera-far={stellarRadius * 15}
      />
    </>
  );
}

// --- Planet Component ---
interface PlanetProps {
  distance: number;
  radius: number;
  orbper: number;
  planetRadius: number;
}

const Planet = React.forwardRef<THREE.Mesh, PlanetProps>(
  ({ distance, radius, orbper, planetRadius }, ref) => {
    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      const angle = (t / orbper) * Math.PI * 2;
      if (ref && typeof ref !== 'function' && ref.current) {
        ref.current.position.x = distance * Math.cos(angle);
        ref.current.position.z = distance * Math.sin(angle);
        ref.current.rotation.y += 0.02;
      }
    });

    // Set planet color to white
    const planetColor = '#ffffff';

    return (
      <mesh ref={ref} castShadow receiveShadow>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial 
          color={planetColor} 
          metalness={0.3} 
          roughness={0.7} 
        />
      </mesh>
    );
  }
);

Planet.displayName = 'Planet';

export interface ExoplanetVisualizationProps {
  data: VisualizationData;
  predictionClass: number;
  confidence: number;
}

export default function ExoplanetVisualization({ 
  data, 
  predictionClass, 
  confidence 
}: ExoplanetVisualizationProps) {
  const planetRef = useRef<THREE.Mesh>(null);

  // --- Orbit points ---
  const orbitPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const angle = (i / 100) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          data.pl_rade * ORBIT_SCALE * Math.cos(angle),
          0,
          data.pl_rade * ORBIT_SCALE * Math.sin(angle)
        )
      );
    }
    return points;
  }, [data.pl_rade]);

  // --- Background stars ---
  const bgStars = useMemo(() => {
    return Array.from({ length: 300 }, () => [
      (Math.random() - 0.5) * 200,
      (Math.random() - 0.5) * 200,
      (Math.random() - 0.5) * 200,
    ]);
  }, []);

  return (
    <div className="w-full h-[600px] relative rounded-lg overflow-hidden border-2 border-primary/20 bg-black">
      {/* Info Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-sm p-4 rounded-lg border border-primary/30 text-white space-y-1 text-sm">
        <div className="font-bold text-lg mb-2 text-primary">System Parameters</div>
        <div>Star Radius: {data.st_rad.toFixed(2)} R☉</div>
        <div>TESS Magnitude: {data.st_tmag.toFixed(2)}</div>
        {data.st_teff && <div>Star Temperature: {data.st_teff.toFixed(0)} K</div>}
        <div>Planet Radius: {data.pl_rade.toFixed(2)} R⊕</div>
        <div>Orbital Period: {data.pl_orbper.toFixed(2)} days</div>
        <div className="pt-2 mt-2 border-t border-primary/30">
          <div className="font-semibold text-green-400">
            {predictionClass === 1 ? "Exoplanet Detected" : "Not an Exoplanet"}
          </div>
          <div>Confidence: {(confidence * 100).toFixed(1)}%</div>
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 right-4 z-10 bg-black/70 backdrop-blur-sm p-3 rounded-lg border border-primary/30 text-white text-xs">
        <div className="font-semibold mb-1">Controls:</div>
        <div>🖱️ Left click + drag: Rotate</div>
        <div>🖱️ Right click + drag: Pan</div>
        <div>⚙️ Scroll: Zoom</div>
      </div>

      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center text-white">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <div>Loading 3D visualization...</div>
            </div>
          </div>
        }
      >
        <Canvas shadows camera={{ position: [0, 15, 25], fov: 40 }}>
          <ambientLight intensity={0.1} />

          {/* Background stars */}
          {bgStars.map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial color="white" />
            </mesh>
          ))}

          {/* Orbit line */}
          <Line 
            points={orbitPoints} 
            color="#0f5194" 
            lineWidth={1.5} 
            dashed={false}
            transparent 
            opacity={0.5} 
          />

          {/* Star */}
          <Star
            stellarRadius={data.st_rad * VISUAL_SCALE}
            tmag={data.st_tmag}
            temperature={data.st_teff}
          />

          {/* Planet */}
          <Planet
            ref={planetRef}
            distance={data.pl_rade * ORBIT_SCALE}
            radius={data.pl_rade * PLANET_SCALE}
            orbper={data.pl_orbper}
            planetRadius={data.pl_rade}
          />

          {/* Camera Controls */}
          <OrbitControls 
            enableDamping 
            dampingFactor={0.05}
            minDistance={5}
            maxDistance={100}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
