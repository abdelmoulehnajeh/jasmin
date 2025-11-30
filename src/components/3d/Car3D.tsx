'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface Car3DModelProps {
  color?: string;
  rotating?: boolean;
}

function CarMesh({ color = '#1e40af', rotating = true }: Car3DModelProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current && rotating) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Car Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Car Top */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[2.5, 0.8, 1.8]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Windows */}
      <mesh position={[0.6, 1.2, 0]} castShadow>
        <boxGeometry args={[1, 0.7, 1.75]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.3} />
      </mesh>

      {/* Front Wheel */}
      <mesh position={[1.2, 0, 1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Front Wheel Inner */}
      <mesh position={[1.2, 0, -1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Back Wheel */}
      <mesh position={[-1.2, 0, 1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Back Wheel Inner */}
      <mesh position={[-1.2, 0, -1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Headlights */}
      <mesh position={[2, 0.6, 0.7]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[2, 0.6, -0.7]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
      </mesh>

      {/* Spoiler */}
      <mesh position={[-1.8, 1.3, 0]} castShadow>
        <boxGeometry args={[0.2, 0.1, 1.8]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default function Car3D({ color, rotating = true }: Car3DModelProps) {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={50} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <spotLight position={[-10, 10, -5]} angle={0.3} penumbra={1} intensity={0.5} castShadow />
        
        {/* Car Model */}
        <CarMesh color={color} rotating={rotating} />
        
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
        
        {/* Environment */}
        <Environment preset="sunset" />
        
        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
