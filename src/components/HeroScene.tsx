"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ── Morphing Icosahedron ── */
function MorphingGeo() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.3 + pointer.y * 0.2;
    meshRef.current.rotation.y = t * 0.15 + pointer.x * 0.2;
    if (wireRef.current) {
      wireRef.current.rotation.copy(meshRef.current.rotation);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group position={[1.5, 0, 0]} scale={1.8}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1, 4]} />
          <MeshDistortMaterial
            color="#6366f1"
            emissive="#4f46e5"
            emissiveIntensity={0.3}
            roughness={0.2}
            metalness={0.8}
            distort={0.35}
            speed={2}
            transparent
            opacity={0.6}
          />
        </mesh>
        <mesh ref={wireRef}>
          <icosahedronGeometry args={[1.02, 4]} />
          <meshBasicMaterial color="#818cf8" wireframe transparent opacity={0.15} />
        </mesh>
      </group>
    </Float>
  );
}

/* ── Floating Particles Ring ── */
function ParticleRing() {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 80; i++) {
      const angle = (i / 80) * Math.PI * 2;
      const r = 3 + Math.random() * 0.8;
      pts.push(
        Math.cos(angle) * r + (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 1.5,
        Math.sin(angle) * r + (Math.random() - 0.5) * 0.5
      );
    }
    return new Float32Array(pts);
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  const posAttr = useMemo(() => new THREE.BufferAttribute(points, 3), [points]);

  return (
    <points ref={ref}>
      <bufferGeometry>
        <primitive attach="attributes-position" object={posAttr} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#818cf8" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

/* ── Main Scene ── */
export default function HeroScene() {
  return (
    <div className="hero-canvas-container">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#818cf8" />
        <pointLight position={[-3, -3, 2]} intensity={0.5} color="#ec4899" />
        <MorphingGeo />
        <ParticleRing />
        <Sparkles count={60} scale={8} size={1.5} speed={0.4} color="#6366f1" opacity={0.4} />
      </Canvas>
    </div>
  );
}
