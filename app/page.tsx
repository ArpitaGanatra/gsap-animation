"use client";

import { Image, Html } from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { geometry } from "maath";
import { useEffect, useRef, useState } from "react";
import { useCategory } from "./context/CategoryContext";
import BottomNav from "@/components/bottom-nav";
import { podcastData } from "@/lib/podcast-data";

extend(geometry);

const SPACING = 2; // Space between cards
const SCROLL_THRESHOLD = 50; // Pixels required to trigger movement

const Home = () => {
  const { selectedCategory } = useCategory();

  return (
    <>
      <Canvas
        dpr={[1, 1.5]}
        camera={{
          fov: 8,
          position: [3, 2, 10],
        }}
      >
        <StackedCards category={selectedCategory} />
      </Canvas>
      <BottomNav />
    </>
  );
};

function StackedCards({ category }) {
  const cardsRef = useRef([]);
  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollAmount = useRef(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

      // Calculate normalized index that wraps around
      let zIndex = (index - scrollIndex) % currentPodcasts.length;
      if (zIndex < 0) zIndex += currentPodcasts.length;

      // Adjust the zOffset calculation to start cards inside the screen
      const zOffset = (-zIndex * SPACING) / 1.5 + 3;
      const isHovered = index === hoveredIndex;

      // Modified opacity calculation
      // Make cards invisible when they're near the start or end of the sequence
      const opacity = zIndex < 1 || zIndex > currentPodcasts.length - 2 ? 0 : 1;

      card.position.lerp(
        {
          x: isHovered ? -0.5 : -1,
          y: -0.5,
          z: zOffset,
        },
        0.1
      );

      // Update material opacity
      if (card.material) {
        card.material.opacity = opacity;
      }
    });
  });

  // Filter podcast data based on category
  const getPodcastsByCategory = () => {
    if (category === "/") return podcastData;
    if (category === "/founders")
      return podcastData.filter((p) => p.category === "Founder");
    if (category === "/vcs")
      return podcastData.filter((p) => p.category === "VC");
    if (category === "/operators") {
      return podcastData.filter((p) =>
        ["COO", "CEO", "Ecosystem", "Growth"].includes(p.category)
      );
    }
    return podcastData; // Default fallback
  };

  const currentPodcasts = getPodcastsByCategory();

  // Add mouse move handler
  const handlePointerMove = (event) => {
    setMousePosition({
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    });
  };

  return (
    <group>
      {currentPodcasts.map((podcast, i) => (
        <mesh
          key={i}
          onPointerEnter={() => setHoveredIndex(i)}
          onPointerLeave={() => setHoveredIndex(null)}
          onPointerMove={handlePointerMove}
        >
          <Image
            ref={(el) => (cardsRef.current[i] = el)}
            transparent
            opacity={1}
            position={[0, 0, -i * SPACING]}
            url={podcast.image}
            alt={`${podcast.guest} - ${podcast.company}`}
            title={podcast.guest}
          >
            <Html
              position={[mousePosition.x, mousePosition.y + 0.1, 0]}
              center
              style={{ pointerEvents: "none" }}
            >
              <div
                className="hover-content"
                style={{
                  opacity: hoveredIndex === i ? 1 : 0,
                  transition: "opacity 0.3s",
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  color: "white",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  transform: "translateY(-100%)", // Move text above cursor
                }}
              >
                {podcast.guest}
              </div>
            </Html>
          </Image>
        </mesh>
      ))}
    </group>
  );
}

export default Home;
