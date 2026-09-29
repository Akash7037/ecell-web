'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

function LogoGeometry() {
  const meshRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const reducedMotion = useReducedMotion();

  useFrame((state) => {
    if (!meshRef.current) return;
    if (reducedMotion) return;

    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;

    if (ringRef.current) {
      ringRef.current.rotation.y = -state.clock.elapsedTime * 0.2;
      ringRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
  });

  return (
    <>
      <group ref={meshRef}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 1.6, 0.3]} />
          <meshPhysicalMaterial
            color="#4c6ef5"
            metalness={0.8}
            roughness={0.2}
            envMapIntensity={1}
            clearcoat={0.5}
          />
        </mesh>
        <mesh position={[0.7, -0.5, 0]}>
          <boxGeometry args={[0.7, 1.2, 0.3]} />
          <meshPhysicalMaterial
            color="#e85d3a"
            metalness={0.8}
            roughness={0.2}
            envMapIntensity={1}
            clearcoat={0.5}
          />
        </mesh>
        <mesh position={[-0.7, -0.3, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.6, 16]} />
          <meshPhysicalMaterial
            color="#91a7ff"
            metalness={0.7}
            roughness={0.3}
            envMapIntensity={0.8}
          />
        </mesh>
      </group>
      <mesh ref={ringRef} position={[0, 0, -0.5]}>
        <torusGeometry args={[1.3, 0.04, 16, 100]} />
        <meshPhysicalMaterial
          color="#5c7cfa"
          metalness={0.9}
          roughness={0.1}
          emissive="#4c6ef5"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[0, 0, -0.7]}>
        <torusGeometry args={[0.9, 0.02, 16, 100]} />
        <meshPhysicalMaterial
          color="#4c6ef5"
          metalness={0.9}
          roughness={0.1}
          emissive="#4c6ef5"
          emissiveIntensity={0.2}
        />
      </mesh>
    </>
  );
}

export function LogoScene() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="w-full h-[500px] md:h-[600px] relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#4c6ef5" />
        <pointLight position={[-5, -3, 3]} intensity={0.5} color="#e85d3a" />
        <directionalLight position={[0, 5, 5]} intensity={0.3} />
        <LogoGeometry />
        {!reducedMotion && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate={!reducedMotion}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI * 0.8}
            minPolarAngle={Math.PI * 0.2}
          />
        )}
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
