"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore, type ZoneName } from "@/store/gameStore";

interface ZoneConfig {
  name: ZoneName;
  label: string;
  position: [number, number, number];
  color: string;
  icon: "building" | "crystal" | "portal" | "tower" | "chest" | "beacon";
}

const ZONES: ZoneConfig[] = [
  { name: "about", label: "About Me", position: [0, 0, -6], color: "#6366f1", icon: "building" },
  { name: "skills", label: "Skills", position: [8, 0, 0], color: "#f59e0b", icon: "crystal" },
  { name: "projects", label: "Projects", position: [5, 0, 8], color: "#10b981", icon: "portal" },
  { name: "education", label: "Education", position: [-5, 0, 8], color: "#3b82f6", icon: "tower" },
  { name: "awards", label: "Awards", position: [-8, 0, 0], color: "#ef4444", icon: "chest" },
  { name: "contact", label: "Contact", position: [0, 0, 12], color: "#8b5cf6", icon: "beacon" },
];

/* Low-poly building */
function Building({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[1.8, 2, 1.8]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[1.5, 1, 4]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.4, 0.91]}>
        <boxGeometry args={[0.5, 0.8, 0.02]} />
        <meshStandardMaterial color="#1e1e1e" />
      </mesh>
    </group>
  );
}

/* Floating crystal */
function Crystal({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
      ref.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });
  return (
    <group>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.8, 1, 0.5, 6]} />
        <meshStandardMaterial color="#374151" flatShading />
      </mesh>
      <mesh ref={ref} position={[0, 1.5, 0]} castShadow>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color={color} flatShading emissive={color} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

/* Portal ring */
function Portal({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z += 0.005;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });
  return (
    <group>
      <mesh ref={ref} position={[0, 1.5, 0]} castShadow>
        <torusGeometry args={[1, 0.15, 6, 8]} />
        <meshStandardMaterial color={color} flatShading emissive={color} emissiveIntensity={0.2} />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.8, 0.4, 6]} />
        <meshStandardMaterial color="#374151" flatShading />
      </mesh>
    </group>
  );
}

/* Tower */
function Tower({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.8, 2.4, 6]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      {/* Battlements */}
      {[0, 1.57, 3.14, 4.71].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.sin(angle) * 0.55, 2.6, Math.cos(angle) * 0.55]}
          castShadow
        >
          <boxGeometry args={[0.25, 0.4, 0.25]} />
          <meshStandardMaterial color={color} flatShading />
        </mesh>
      ))}
    </group>
  );
}

/* Treasure chest */
function Chest({ color }: { color: string }) {
  const lidRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (lidRef.current) {
      lidRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.15 - 0.1;
    }
  });
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1, 0.7, 0.7]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      {/* Lid */}
      <mesh ref={lidRef} position={[0, 0.75, -0.3]} castShadow>
        <boxGeometry args={[1.05, 0.15, 0.75]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      {/* Glow from inside */}
      <pointLight position={[0, 0.5, 0]} intensity={0.5} color="#fbbf24" distance={2} />
    </group>
  );
}

/* Beacon */
function Beacon({ color }: { color: string }) {
  const glowRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });
  return (
    <group>
      {/* Pillar */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.3, 2, 6]} />
        <meshStandardMaterial color="#6b7280" flatShading />
      </mesh>
      {/* Glow orb */}
      <mesh ref={glowRef} position={[0, 2.3, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} flatShading transparent opacity={0.9} />
      </mesh>
      <pointLight position={[0, 2.3, 0]} intensity={1} color={color} distance={5} />
    </group>
  );
}

function ZoneStructure({ icon, color }: { icon: string; color: string }) {
  switch (icon) {
    case "building": return <Building color={color} />;
    case "crystal": return <Crystal color={color} />;
    case "portal": return <Portal color={color} />;
    case "tower": return <Tower color={color} />;
    case "chest": return <Chest color={color} />;
    case "beacon": return <Beacon color={color} />;
    default: return <Building color={color} />;
  }
}

function InteractionIndicator({ visible, color }: { visible: boolean; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = 3.5 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
      ref.current.rotation.y += 0.03;
    }
  });

  if (!visible) return null;

  return (
    <mesh ref={ref} position={[0, 3.5, 0]}>
      <octahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} flatShading />
    </mesh>
  );
}

function Zone({ config, playerPosition }: { config: ZoneConfig; playerPosition: THREE.Vector3 | null }) {
  const { enterZone, activeZone } = useGameStore();
  const distance = playerPosition
    ? playerPosition.distanceTo(new THREE.Vector3(...config.position))
    : Infinity;
  const isNear = distance < 3.5;
  const isActive = activeZone === config.name;

  // Auto-enter zone when close enough
  useFrame(() => {
    if (isNear && !isActive && !activeZone) {
      // Show indicator but don't auto-enter
    }
  });

  return (
    <group position={config.position}>
      <ZoneStructure icon={config.icon} color={config.color} />

      {/* Platform base */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[2, 2.2, 0.1, 8]} />
        <meshStandardMaterial color="#1e293b" flatShading />
      </mesh>

      {/* Zone label */}
      <Billboard position={[0, 3.8, 0]}>
        <Text
          fontSize={0.35}
          color={isNear ? config.color : "#ffffff"}
          anchorX="center"
          anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {config.label}
          </Text>
          {isNear && !activeZone && (
            <Text
              fontSize={0.18}
              color="#94a3b8"
              anchorX="center"
              anchorY="middle"
              position={[0, -0.4, 0]}
              outlineWidth={0.01}
              outlineColor="#000000"
          >
            Press E to interact
          </Text>
        )}
      </Billboard>

      {/* Interaction indicator */}
      <InteractionIndicator visible={isNear && !activeZone} color={config.color} />

      {/* Invisible interaction mesh */}
      <mesh
        position={[0, 1, 0]}
        visible={false}
        onClick={() => {
          if (isNear) enterZone(config.name);
        }}
      >
        <sphereGeometry args={[2.5, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Area glow */}
      <pointLight
        position={[0, 0.5, 0]}
        intensity={isNear ? 1.5 : 0.3}
        color={config.color}
        distance={isNear ? 6 : 3}
      />
    </group>
  );
}

export default function PortfolioZones({ playerPosition }: { playerPosition: THREE.Vector3 | null }) {
  const { enterZone, activeZone } = useGameStore();

  // Listen for E key to enter zones
  useFrame(() => {});

  // E key handler is in the parent - we pass it here
  return (
    <>
      {ZONES.map((zone) => (
        <Zone key={zone.name} config={zone} playerPosition={playerPosition} />
      ))}
    </>
  );
}

export { ZONES };
export type { ZoneConfig };
