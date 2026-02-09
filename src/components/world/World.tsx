"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Environment from "./Environment";
import Player from "./Player";
import PortfolioZones, { ZONES } from "./PortfolioZones";
import HUD from "./HUD";
import { useGameStore } from "@/store/gameStore";

function LoadingScreen() {
  return (
    <div className="absolute inset-0 bg-[#050505] flex flex-col items-center justify-center z-50">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-indigo-500 animate-spin" />
      </div>
      <p className="mt-6 text-white/40 text-sm font-mono">Loading world...</p>
    </div>
  );
}

function Scene() {
  const [playerPos, setPlayerPos] = useState<THREE.Vector3 | null>(null);
  const { enterZone, exitZone, activeZone } = useGameStore();
  const playerPosRef = useRef<THREE.Vector3 | null>(null);

  const handlePositionChange = useCallback((pos: THREE.Vector3) => {
    playerPosRef.current = pos;
    setPlayerPos(pos);

    // Auto-close zone if player walks away
    if (activeZone) {
      const zoneConfig = ZONES.find((z) => z.name === activeZone);
      if (zoneConfig) {
        const dist = pos.distanceTo(new THREE.Vector3(...zoneConfig.position));
        if (dist > 5) exitZone();
      }
    }
  }, [activeZone, exitZone]);

  // E key to interact with nearest zone
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyE" && playerPosRef.current && !activeZone) {
        let nearest: (typeof ZONES)[0] | null = null;
        let minDist = Infinity;
        for (const zone of ZONES) {
          const dist = playerPosRef.current.distanceTo(new THREE.Vector3(...zone.position));
          if (dist < minDist) {
            minDist = dist;
            nearest = zone;
          }
        }
        if (nearest && minDist < 3.5) {
          enterZone(nearest.name);
        }
      }
      if (e.code === "Escape") {
        exitZone();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeZone, enterZone, exitZone]);

  return (
    <>
      <Environment />
      <Player onPositionChange={handlePositionChange} />
      <PortfolioZones playerPosition={playerPos} />
    </>
  );
}

export default function World() {
  return (
    <div className="fixed inset-0 bg-[#050505]">
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          shadows
          camera={{ position: [8, 10, 8], fov: 45 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          <Scene />
        </Canvas>
      </Suspense>
      <HUD />
    </div>
  );
}
