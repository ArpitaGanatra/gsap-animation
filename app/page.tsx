"use client";

import { Image } from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { geometry } from "maath";
import { useEffect, useRef, useState } from "react";

extend(geometry);

const NUM_CARDS = 17;
const SPACING = 2; // Space between cards
const SCROLL_THRESHOLD = 50; // Pixels required to trigger movement

const Home = () => (
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
      event.preventDefault(); // Prevent default scroll behavior
      scrollAmount.current += event.deltaY;

      if (Math.abs(scrollAmount.current) > SCROLL_THRESHOLD) {
        setScrollIndex((prev) => prev + Math.sign(scrollAmount.current)); // Move one step
        scrollAmount.current = 0; // Reset accumulator
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false }); // Add { passive: false } to allow preventDefault
    return () => window.removeEventListener("wheel", handleScroll);
  }, []);

  useFrame(() => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      let zIndex = (index - scrollIndex) % NUM_CARDS;
      if (zIndex < 0) zIndex += NUM_CARDS;

      const zOffset = (-zIndex * SPACING) / 1.5;

      card.position.set(-1, -0.5, zOffset);
      card.rotation.set(0, -0.3, 0);
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
          alt={`card-${i}`}
        />
      ))}
    </group>
  );
}

export default Home;
