"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/store/gameStore";

const SPEED = 5;
const ROTATION_SPEED = 3;

interface PlayerProps {
  onPositionChange?: (pos: THREE.Vector3) => void;
}

export default function Player({ onPositionChange }: PlayerProps) {
    const groupRef = useRef<THREE.Group>(null);
    const modelRef = useRef<THREE.Group>(null);
    const { camera } = useThree();
    const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const rotation = useRef(0);
  const bobPhase = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          setKeys((k) => ({ ...k, forward: true }));
          break;
        case "KeyS":
        case "ArrowDown":
          setKeys((k) => ({ ...k, backward: true }));
          break;
        case "KeyA":
        case "ArrowLeft":
          setKeys((k) => ({ ...k, left: true }));
          break;
        case "KeyD":
        case "ArrowRight":
          setKeys((k) => ({ ...k, right: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          setKeys((k) => ({ ...k, forward: false }));
          break;
        case "KeyS":
        case "ArrowDown":
          setKeys((k) => ({ ...k, backward: false }));
          break;
        case "KeyA":
        case "ArrowLeft":
          setKeys((k) => ({ ...k, left: false }));
          break;
        case "KeyD":
        case "ArrowRight":
          setKeys((k) => ({ ...k, right: false }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current || !modelRef.current) return;

    const pos = groupRef.current.position;
    direction.current.set(0, 0, 0);

    if (keys.forward) direction.current.z -= 1;
    if (keys.backward) direction.current.z += 1;
    if (keys.left) direction.current.x -= 1;
    if (keys.right) direction.current.x += 1;

    const isMoving = direction.current.length() > 0;

    if (isMoving) {
      direction.current.normalize();

      // Smooth rotation toward movement direction
      const targetRotation = Math.atan2(direction.current.x, direction.current.z);
      rotation.current = THREE.MathUtils.lerp(
        rotation.current,
        targetRotation,
        ROTATION_SPEED * delta
      );
      // Handle wrapping
      const diff = targetRotation - rotation.current;
      if (Math.abs(diff) > Math.PI) {
        rotation.current += Math.sign(diff) * Math.PI * 2;
        rotation.current = THREE.MathUtils.lerp(
          rotation.current,
          targetRotation,
          ROTATION_SPEED * delta
        );
      }

      modelRef.current.rotation.y = rotation.current;

      // Movement
      velocity.current.lerp(direction.current.multiplyScalar(SPEED), 4 * delta);

        // Walking animation
        bobPhase.current += delta * 10;
        modelRef.current.position.y = Math.sin(bobPhase.current) * 0.05;

        // Swing limbs
        const swing = Math.sin(bobPhase.current) * 0.6;
        if (leftArmRef.current) leftArmRef.current.rotation.x = swing;
        if (rightArmRef.current) rightArmRef.current.rotation.x = -swing;
        if (leftLegRef.current) leftLegRef.current.rotation.x = -swing;
        if (rightLegRef.current) rightLegRef.current.rotation.x = swing;
      } else {
        velocity.current.lerp(new THREE.Vector3(0, 0, 0), 6 * delta);
        modelRef.current.position.y = THREE.MathUtils.lerp(modelRef.current.position.y, 0, 5 * delta);
        bobPhase.current = 0;

        // Return limbs to rest
        if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 8 * delta);
        if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 8 * delta);
        if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 8 * delta);
        if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 8 * delta);
      }

    pos.x += velocity.current.x * delta;
    pos.z += velocity.current.z * delta;

    // Keep within bounds
    pos.x = THREE.MathUtils.clamp(pos.x, -25, 25);
    pos.z = THREE.MathUtils.clamp(pos.z, -25, 25);

    // Camera follow - isometric-ish angle
    const cameraOffset = new THREE.Vector3(8, 10, 8);
    const targetCameraPos = pos.clone().add(cameraOffset);
    camera.position.lerp(targetCameraPos, 3 * delta);
    camera.lookAt(pos.x, pos.y + 1, pos.z);

      onPositionChange?.(pos.clone());
      setPlayerPosition(pos.x, pos.z);
  });

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      <group ref={modelRef}>
        {/* Simple low-poly character */}
        {/* Body */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.5, 0.7, 0.3]} />
          <meshStandardMaterial color="#6366f1" flatShading />
        </mesh>

        {/* Head */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.35]} />
          <meshStandardMaterial color="#fbbf24" flatShading />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.1, 1.15, 0.18]}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial color="#1e1e1e" />
        </mesh>
        <mesh position={[0.1, 1.15, 0.18]}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial color="#1e1e1e" />
        </mesh>

          {/* Arms - pivoted at shoulder */}
          <group ref={leftArmRef} position={[-0.37, 0.7, 0]}>
            <mesh position={[0, -0.25, 0]} castShadow>
              <boxGeometry args={[0.18, 0.55, 0.2]} />
              <meshStandardMaterial color="#818cf8" flatShading />
            </mesh>
          </group>
          <group ref={rightArmRef} position={[0.37, 0.7, 0]}>
            <mesh position={[0, -0.25, 0]} castShadow>
              <boxGeometry args={[0.18, 0.55, 0.2]} />
              <meshStandardMaterial color="#818cf8" flatShading />
            </mesh>
          </group>

          {/* Legs - pivoted at hip */}
          <group ref={leftLegRef} position={[-0.12, 0.17, 0]}>
            <mesh position={[0, -0.22, 0]} castShadow>
              <boxGeometry args={[0.2, 0.45, 0.25]} />
              <meshStandardMaterial color="#4338ca" flatShading />
            </mesh>
          </group>
          <group ref={rightLegRef} position={[0.12, 0.17, 0]}>
            <mesh position={[0, -0.22, 0]} castShadow>
              <boxGeometry args={[0.2, 0.45, 0.25]} />
              <meshStandardMaterial color="#4338ca" flatShading />
            </mesh>
          </group>

        {/* Point light on character */}
        <pointLight position={[0, 1.5, 0.5]} intensity={0.3} color="#a78bfa" distance={3} />
      </group>
    </group>
  );
}
