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

      let zIndex = (index - scrollIndex) % currentPodcasts.length;
      if (zIndex < 0) zIndex += currentPodcasts.length;

      const zOffset = (-zIndex * SPACING) / 1.5;

      card.position.set(-1, -0.5, zOffset);
      card.rotation.set(0, -0.3, 0);
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

  return (
    <group>
      {currentPodcasts.map((podcast, i) => (
        <mesh key={i}>
          <Image
            ref={(el) => (cardsRef.current[i] = el)}
            transparent
            opacity={1}
            position={[0, 0, -i * SPACING]}
            url={podcast.image}
            alt={`${podcast.guest} - ${podcast.company}`}
            title={podcast.guest}
          >
            <Html>
              <div
                className="hover-content"
                style={{
                  opacity: 0,
                  transition: "opacity 0.3s",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  padding: "8px",
                  borderRadius: "4px",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
              >
                {podcast.guest} - {podcast.company}
              </div>
            </Html>
          </Image>
        </mesh>
      ))}
    </group>
  );
}

export default Home;
