"use client";

import { Image, Html } from "@react-three/drei";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { useCategory } from "./context/CategoryContext";
import BottomNav from "@/components/bottom-nav";
import { podcastData } from "@/lib/podcast-data";
import * as THREE from "three";

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

// Update the CardElement type
type CardElement = THREE.Mesh & {
  material: THREE.Material & { opacity: number };
};

interface StackedCardsProps {
  category: string;
}

function StackedCards({ category }: StackedCardsProps) {
  const cardsRef = useRef<(CardElement | null)[]>([]);
  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollAmount = useRef(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // const [cardDimensions, setCardDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      event.preventDefault();
      scrollAmount.current += event.deltaY;

      if (Math.abs(scrollAmount.current) > SCROLL_THRESHOLD) {
        setScrollIndex((prev) => prev + Math.sign(scrollAmount.current));
        scrollAmount.current = 0;
      }
    };

    // Fix the ref warning by copying the ref value
    const options = { passive: false };
    window.addEventListener("wheel", handleScroll, options);

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, []);

  useFrame(() => {
    // Copy ref to local variable to avoid stale closure warning
    const currentCards = cardsRef.current;
    if (!currentCards) return;

    currentCards.forEach((card, index) => {
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

  // Update handlePointerMove to use ThreeEvent
  const handlePointerMove = (
    event: ThreeEvent<PointerEvent>,
    mesh: THREE.Mesh
  ) => {
    if (!mesh) return;

    const rect = (event.target as HTMLElement)?.getBoundingClientRect();
    if (!rect) return;

    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    setMousePosition({ x, y });
  };

  return (
    <group>
      {currentPodcasts.map((podcast, i) => (
        <mesh
          key={i}
          onPointerEnter={() => setHoveredIndex(i)}
          onPointerLeave={() => setHoveredIndex(null)}
          onPointerMove={(e) => handlePointerMove(e, e.object as THREE.Mesh)}
        >
          <Image
            ref={(el: CardElement | null) => {
              cardsRef.current[i] = el;
            }}
            transparent
            opacity={1}
            position={[0, 0, -i * SPACING]}
            url={podcast.image}
            alt={`${podcast.guest} - ${podcast.company}`}
            title={podcast.guest}
            onError={(e: { target: HTMLImageElement }) => {
              console.warn(`Failed to load image for ${podcast.guest}:`, e);
              // Optionally set a fallback image
              e.target.src = "/logos/polygon.png";
            }}
          >
            <Html
              position={[mousePosition.x, mousePosition.y + 0.2, 0]}
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
                  transform: "translateY(-100%)", // Move tooltip above cursor
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
