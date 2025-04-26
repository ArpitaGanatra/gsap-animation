"use client";

import { Image, Html } from "@react-three/drei";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { useCategory } from "../context/CategoryContext";
import BottomNav from "@/components/bottom-nav";
import { podcastData } from "@/lib/podcast-data";
import * as THREE from "three";

const SCROLL_THRESHOLD = 50; // Pixels required to trigger movement

const MobileView = () => {
  const { selectedCategory } = useCategory();
  const [isMobile, setIsMobile] = useState(false);

  // Add useEffect to detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile(); // Check on initial render
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      <Canvas
        dpr={[1, 1.5]}
        camera={{
          fov: 40,
          position: [0, 0, 6],
        }}
        gl={{
          powerPreference: "high-performance",
          antialias: true,
          preserveDrawingBuffer: true,
        }}
      >
        <StackedCards category={selectedCategory} isMobile={isMobile} />
      </Canvas>
      <BottomNav />
    </>
  );
};

type CardElement = THREE.Mesh & {
  material: THREE.Material & { opacity: number };
};

interface StackedCardsProps {
  category: string;
  isMobile: boolean;
}

function StackedCards({ category, isMobile }: StackedCardsProps) {
  const cardsRef = useRef<(CardElement | null)[]>([]);
  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollAmount = useRef(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const SPACING = 0.11;
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      event.preventDefault();
      scrollAmount.current += event.deltaY;

      if (Math.abs(scrollAmount.current) > SCROLL_THRESHOLD) {
        setScrollIndex((prev) => prev + Math.sign(scrollAmount.current));
        scrollAmount.current = 0;
      }
    };

    // Add touch event handlers
    const handleTouchStart = (event: TouchEvent) => {
      touchStartY.current = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (touchStartY.current === null) return;

      const touchDelta = touchStartY.current - event.touches[0].clientY;
      scrollAmount.current += touchDelta;

      if (Math.abs(scrollAmount.current) > SCROLL_THRESHOLD) {
        setScrollIndex((prev) => prev + Math.sign(scrollAmount.current));
        scrollAmount.current = 0;
        touchStartY.current = event.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      touchStartY.current = null;
    };

    const options = { passive: false };
    window.addEventListener("wheel", handleScroll, options);
    window.addEventListener("touchstart", handleTouchStart, options);
    window.addEventListener("touchmove", handleTouchMove, options);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
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

      // Calculate diagonal position for mobile devices
      const diagonalOffset = zIndex * 0.14;

      const centerIndex = 8;
      const isCenterCard = zIndex === centerIndex;

      card.position.lerp(
        {
          x: isHovered
            ? -0.8
            : -1.5 + diagonalOffset * 1.2 + (isCenterCard ? 0.3 : 0), // shift center card
          y: -1.5 + diagonalOffset * 1.2,
          z: zOffset,
        },
        0.1
      );

      // Update material opacity
      if (card.material) {
        const opacity =
          zIndex < 1 || zIndex > currentPodcasts.length - 2 ? 0 : 1;
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
            scale={[0.6, 0.6, 0.6]}
            position={[0, 0, -i * SPACING]}
            url={podcast.image}
            alt={`${podcast.guest} - ${podcast.company}`}
            title={podcast.guest}
            onError={(e: { target: HTMLImageElement }) => {
              console.warn(`Failed to load image for ${podcast.guest}:`, e);
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
                  opacity: hoveredIndex === i && !isMobile ? 1 : 0,
                  transition: "opacity 0.3s",
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
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

export default MobileView;
