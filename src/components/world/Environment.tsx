"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import * as THREE from "three";

/* Low-poly tree */
function LowPolyTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 1.2, 6]} />
        <meshStandardMaterial color="#5c3d2e" flatShading />
      </mesh>
      {/* Foliage layers */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <coneGeometry args={[0.6, 1.2, 6]} />
        <meshStandardMaterial color="#2d6a4f" flatShading />
      </mesh>
      <mesh position={[0, 2.2, 0]} castShadow>
        <coneGeometry args={[0.45, 0.9, 6]} />
        <meshStandardMaterial color="#40916c" flatShading />
      </mesh>
      <mesh position={[0, 2.7, 0]} castShadow>
        <coneGeometry args={[0.3, 0.7, 6]} />
        <meshStandardMaterial color="#52b788" flatShading />
      </mesh>
    </group>
  );
}

/* Low-poly rock */
function Rock({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <mesh position={position} scale={scale} castShadow>
      <dodecahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial color="#6b7280" flatShading />
    </mesh>
  );
}

/* Floating particles */
function Particles() {
  const ref = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 15 + 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
      const posArr = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        posArr[i * 3 + 1] += Math.sin(Date.now() * 0.001 + i) * 0.002;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#a78bfa" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

/* Water plane */
function Water() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = -0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow>
      <circleGeometry args={[50, 32]} />
      <meshStandardMaterial color="#1e40af" transparent opacity={0.4} flatShading />
    </mesh>
  );
}

/* Ground with low-poly displacement */
function Ground() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(80, 80, 30, 30);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i);
      const dist = Math.sqrt(x * x + z * z);
      // Create a gentle island shape - higher in center, lower at edges
      let height = Math.max(0, 3 - dist * 0.08);
      // Add some noise for outer area only
      if (dist >= 15) height += (Math.random() - 0.5) * 0.3;
      // Flatten the center area for walking (nearly flat at Y=0)
      if (dist < 15) height = 0.01 + (Math.random()) * 0.03;
      pos.setZ(i, height);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow geometry={geometry}>
      <meshStandardMaterial color="#4a7c59" flatShading />
    </mesh>
  );
}

/* Path between zones */
function Path() {
  const points = useMemo(() => {
    return [
      new THREE.Vector3(0, 0.02, 0),
      new THREE.Vector3(6, 0.02, 4),
      new THREE.Vector3(12, 0.02, -2),
      new THREE.Vector3(-6, 0.02, -6),
      new THREE.Vector3(-12, 0.02, 2),
      new THREE.Vector3(0, 0.02, 10),
    ];
  }, []);

  return (
    <>
      {points.map((point, i) => {
        if (i === points.length - 1) return null;
        const next = points[(i + 1) % points.length];
        const mid = new THREE.Vector3().lerpVectors(point, next, 0.5);
        const dir = new THREE.Vector3().subVectors(next, point);
        const length = dir.length();
        const angle = Math.atan2(dir.x, dir.z);
        return (
          <mesh key={i} position={[mid.x, 0.05, mid.z]} rotation={[-Math.PI / 2, 0, -angle]} receiveShadow>
            <planeGeometry args={[0.8, length]} />
            <meshStandardMaterial color="#c2b280" flatShading />
          </mesh>
        );
      })}
    </>
  );
}

export default function Environment() {
  // Deterministic tree and rock positions
  const trees = useMemo(
    () => [
      { pos: [-15, 0, -10] as [number, number, number], scale: 1.2 },
      { pos: [-18, 0, -5] as [number, number, number], scale: 0.8 },
      { pos: [16, 0, -8] as [number, number, number], scale: 1.0 },
      { pos: [20, 0, 5] as [number, number, number], scale: 1.3 },
      { pos: [-20, 0, 8] as [number, number, number], scale: 0.9 },
      { pos: [10, 0, 15] as [number, number, number], scale: 1.1 },
      { pos: [-10, 0, 16] as [number, number, number], scale: 0.7 },
      { pos: [22, 0, -15] as [number, number, number], scale: 1.0 },
      { pos: [-22, 0, -14] as [number, number, number], scale: 1.4 },
      { pos: [5, 0, -18] as [number, number, number], scale: 0.9 },
      { pos: [-5, 0, 20] as [number, number, number], scale: 1.1 },
      { pos: [18, 0, 12] as [number, number, number], scale: 0.8 },
    ],
    []
  );

  const rocks = useMemo(
    () => [
      { pos: [-8, 0.2, -12] as [number, number, number], scale: 0.8 },
      { pos: [14, 0.2, 10] as [number, number, number], scale: 1.2 },
      { pos: [-16, 0.2, 3] as [number, number, number], scale: 0.6 },
      { pos: [8, 0.2, -14] as [number, number, number], scale: 1.0 },
      { pos: [-3, 0.2, 14] as [number, number, number], scale: 0.7 },
    ],
    []
  );

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[15, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={60}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <pointLight position={[0, 8, 0]} intensity={0.5} color="#a78bfa" />

      {/* Sky */}
      <Sky sunPosition={[100, 40, 100]} turbidity={2} rayleigh={0.5} mieCoefficient={0.005} />
      <fog attach="fog" args={["#87ceeb", 30, 60]} />

      {/* Terrain */}
      <Ground />
      <Water />
      <Path />

      {/* Trees */}
      {trees.map((t, i) => (
        <LowPolyTree key={`tree-${i}`} position={t.pos} scale={t.scale} />
      ))}

      {/* Rocks */}
      {rocks.map((r, i) => (
        <Rock key={`rock-${i}`} position={r.pos} scale={r.scale} />
      ))}

      {/* Particles */}
      <Particles />
    </>
  );
}
