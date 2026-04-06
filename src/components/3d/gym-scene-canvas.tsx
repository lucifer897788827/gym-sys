"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function Dumbbell() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.3;
    groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.15;
  });

  const metalMaterial = new THREE.MeshStandardMaterial({
    color: "#6C5CE7",
    metalness: 0.8,
    roughness: 0.2,
  });

  const gripMaterial = new THREE.MeshStandardMaterial({
    color: "#2a2a4a",
    metalness: 0.3,
    roughness: 0.8,
  });

  return (
    <group ref={groupRef} scale={0.8}>
      {/* Center bar */}
      <mesh material={gripMaterial} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.4, 16]} />
      </mesh>

      {/* Left weight plates */}
      <mesh material={metalMaterial} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <group position={[-1.0, 0, 0]}>
          <mesh material={metalMaterial}>
            <cylinderGeometry args={[0.4, 0.4, 0.2, 24]} />
          </mesh>
        </group>
      </mesh>
      <mesh material={metalMaterial} position={[-1.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 24]} />
      </mesh>
      <mesh material={metalMaterial} position={[-0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.32, 0.32, 0.15, 24]} />
      </mesh>

      {/* Right weight plates */}
      <mesh material={metalMaterial} position={[1.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 24]} />
      </mesh>
      <mesh material={metalMaterial} position={[0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.32, 0.32, 0.15, 24]} />
      </mesh>

      {/* End caps */}
      <mesh material={gripMaterial} position={[-1.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>
      <mesh material={gripMaterial} position={[1.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>
    </group>
  );
}

export default function GymSceneCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#6C5CE7" />
      <pointLight position={[-5, -3, 3]} intensity={0.5} color="#00D2FF" />
      <Dumbbell />
    </Canvas>
  );
}
