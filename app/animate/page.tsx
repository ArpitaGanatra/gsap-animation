"use client";

import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { Image } from "@react-three/drei";
import { geometry } from "maath";

extend(geometry);

const NUM_CARDS = 17;
const SPACING = 2; // Space between cards
const SCROLL_THRESHOLD = 50; // Pixels required to trigger movement

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
  const scrollAmount = useRef(0);

  useEffect(() => {
    const handleScroll = (event: { deltaY: number }) => {
      scrollAmount.current += event.deltaY;

      if (Math.abs(scrollAmount.current) > SCROLL_THRESHOLD) {
        setScrollIndex((prev) => prev + Math.sign(scrollAmount.current)); // Move one step
        scrollAmount.current = 0; // Reset accumulator
      }
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, []);

  useFrame(() => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      // Compute new Z position with smooth wrapping
      let zIndex = (index - scrollIndex) % NUM_CARDS;
      if (zIndex < 0) zIndex += NUM_CARDS;

      card.position.set(-1, -1, (-zIndex * SPACING) / 1.5);
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
        />
      ))}
    </group>
  );
}

export default App;
