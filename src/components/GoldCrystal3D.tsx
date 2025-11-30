'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function GoldCrystal() {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Create floating particles
  const particles = useMemo(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }

    return positions;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.2;
      meshRef.current.rotation.y = time * 0.3;
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.3;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.05;
      particlesRef.current.rotation.x = time * 0.03;
    }
  });

  return (
    <>
      {/* Main Gold Crystal */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh ref={meshRef} scale={2}>
          <icosahedronGeometry args={[1, 1]} />
          <MeshDistortMaterial
            color="#FFD700"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.1}
            metalness={0.9}
            emissive="#FFA500"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>

      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#FFD700"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Ambient Light */}
      <ambientLight intensity={0.5} />

      {/* Point Lights for Crystal Effect */}
      <pointLight position={[2, 2, 2]} intensity={1} color="#FFD700" />
      <pointLight position={[-2, -2, -2]} intensity={0.5} color="#FFA500" />
      <pointLight position={[0, 3, 0]} intensity={0.8} color="#FFFFFF" />
    </>
  );
}

export default function GoldCrystal3D() {
  return (
    <div className="w-full h-full absolute inset-0 opacity-30">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <GoldCrystal />
      </Canvas>
    </div>
  );
}
