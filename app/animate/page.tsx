"use client";

import { Image } from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { geometry } from "maath";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

extend(geometry);

const NUM_CARDS = 17;
const SPACING = 2;
const SCROLL_THRESHOLD = 50;
const HOVER_OFFSET = 0.2; // Increased offset for more noticeable effect
const LERP_FACTOR = 0.1; // Controls animation smoothness (0-1)

const App = () => (
  <Canvas
    dpr={[1, 1.5]}
    camera={{
      fov: 8,
      position: [3, 2, 10],
    }}
  >
    <StackedCards />
  </Canvas>
);

function StackedCards() {
  const cardsRef = useRef([]);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollAmount = useRef(0);
  const targetPositions = useRef(
    Array(NUM_CARDS)
      .fill(null)
      .map(() => new THREE.Vector3())
  );
  const currentVelocities = useRef(
    Array(NUM_CARDS)
      .fill(null)
      .map(() => new THREE.Vector3())
  );

  useEffect(() => {
    const handleScroll = (event: { deltaY: number }) => {
      scrollAmount.current += event.deltaY;

      if (Math.abs(scrollAmount.current) > SCROLL_THRESHOLD) {
        setScrollIndex((prev) => prev + Math.sign(scrollAmount.current));
        scrollAmount.current = 0;
      }
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, []);

  useFrame((state, delta) => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      let zIndex = (index - scrollIndex) % NUM_CARDS;
      if (zIndex < 0) zIndex += NUM_CARDS;

      const zOffset = (-zIndex * SPACING) / 1.5;
      const isHovered = index === hoveredIndex;

      // Set target position
      const targetX = isHovered ? -1 + HOVER_OFFSET : -1;
      const targetY = -0.5;
      const targetRotationY = isHovered ? -0.2 : -0.3; // Slight rotation change on hover

      // Update target position
      targetPositions.current[index].set(targetX, targetY, zOffset);

      // Smooth interpolation using spring-like motion
      const currentPosition = card.position;
      const currentVelocity = currentVelocities.current[index];

      // Position interpolation
      currentPosition.x +=
        (targetPositions.current[index].x - currentPosition.x) * LERP_FACTOR;
      currentPosition.y +=
        (targetPositions.current[index].y - currentPosition.y) * LERP_FACTOR;
      currentPosition.z +=
        (targetPositions.current[index].z - currentPosition.z) * LERP_FACTOR;

      // Rotation interpolation
      card.rotation.y += (targetRotationY - card.rotation.y) * LERP_FACTOR;

      // Add subtle floating animation when hovered
      if (isHovered) {
        card.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.002;
      }
    });
  });

  const images = [
    "https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?w=1200",
    "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=1200",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200",
    "https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=1200",
    "https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?w=1200",
  ];

  return (
    <group>
      {Array.from({ length: NUM_CARDS }, (_, i) => (
        <Image
          key={i}
          ref={(el) => (cardsRef.current[i] = el)}
          transparent
          opacity={1}
          position={[0, 0, -i * SPACING]}
          url={images[i % images.length]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredIndex(i);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHoveredIndex(null);
          }}
        />
      ))}
    </group>
  );
}

export default App;
