"use client";

import { Image, Html } from "@react-three/drei";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { useCategory } from "../context/CategoryContext";
import BottomNav from "@/components/bottom-nav";
import { podcastData } from "@/lib/podcast-data";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import slugify from "slugify";

const SCROLL_THRESHOLD = 50; // Pixels required to trigger movement

const WebView = () => {
  const { selectedCategory } = useCategory();

  return (
    <>
      <Canvas
        dpr={[1, 1.5]}
        camera={{
          fov: 9,
          position: [2, 2, 10],
        }}
        gl={{
          powerPreference: "high-performance",
          antialias: true,
          preserveDrawingBuffer: true,
        }}
      >
        <StackedCards category={selectedCategory} />
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
}

function StackedCards({ category }: StackedCardsProps) {
  const cardsRef = useRef<(CardElement | null)[]>([]);
  const [scrollIndex, setScrollIndex] = useState(0);
  const targetScrollIndex = useRef(0);
  const scrollAmount = useRef(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const SPACING = 1.5;
  const touchStartY = useRef<number | null>(null);
  const lastScrollTime = useRef(0);
  const scrollVelocity = useRef(0);
  const router = useRouter();
  const [clickDisabled, setClickDisabled] = useState(false);

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      if (clickDisabled) return; // Prevent scroll/animation during cooldown
      event.preventDefault();
      // Different speed limits for forward and reverse scrolling
      const maxForwardScrollSpeed = 50;
      const maxReverseScrollSpeed = 80; // Increased reverse scroll speed
      const maxScrollSpeed =
        event.deltaY > 0 ? maxForwardScrollSpeed : maxReverseScrollSpeed;
      const limitedDelta =
        Math.sign(event.deltaY) *
        Math.min(Math.abs(event.deltaY), maxScrollSpeed);
      scrollAmount.current += limitedDelta;

      // Calculate scroll velocity
      const now = Date.now();
      const timeDelta = now - lastScrollTime.current;
      if (timeDelta > 0) {
        scrollVelocity.current = limitedDelta / timeDelta;
      }
      lastScrollTime.current = now;

      if (Math.abs(scrollAmount.current) > SCROLL_THRESHOLD) {
        targetScrollIndex.current += Math.sign(scrollAmount.current);
        scrollAmount.current = 0;
      }
    };

    // Add touch event handlers with speed limiting
    const handleTouchStart = (event: TouchEvent) => {
      if (clickDisabled) return; // Prevent scroll/animation during cooldown
      touchStartY.current = event.touches[0].clientY;
      lastScrollTime.current = Date.now();
      scrollVelocity.current = 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (clickDisabled) return; // Prevent scroll/animation during cooldown
      if (touchStartY.current === null) return;

      const touchDelta = touchStartY.current - event.touches[0].clientY;
      // Different speed limits for forward and reverse scrolling
      const maxForwardTouchSpeed = 30;
      const maxReverseTouchSpeed = 20; // More restrictive for reverse scrolling
      const maxTouchSpeed =
        touchDelta > 0 ? maxForwardTouchSpeed : maxReverseTouchSpeed;
      const limitedDelta =
        Math.sign(touchDelta) * Math.min(Math.abs(touchDelta), maxTouchSpeed);
      scrollAmount.current += limitedDelta;

      // Calculate touch velocity
      const now = Date.now();
      const timeDelta = now - lastScrollTime.current;
      if (timeDelta > 0) {
        scrollVelocity.current = limitedDelta / timeDelta;
      }
      lastScrollTime.current = now;

      if (Math.abs(scrollAmount.current) > SCROLL_THRESHOLD) {
        targetScrollIndex.current += Math.sign(scrollAmount.current);
        scrollAmount.current = 0;
        touchStartY.current = event.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      touchStartY.current = null;
      // Apply momentum scrolling
      if (Math.abs(scrollVelocity.current) > 0.1) {
        const momentum =
          Math.sign(scrollVelocity.current) *
          Math.min(Math.abs(scrollVelocity.current) * 10, 3);
        targetScrollIndex.current += momentum;
      }
      scrollVelocity.current = 0;
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
    // Smoothly interpolate scrollIndex toward targetScrollIndex with velocity-based lerp
    setScrollIndex((prev) => {
      const lerpFactor = Math.min(
        0.5, // Increased base lerp factor
        0.2 + Math.abs(scrollVelocity.current) * 0.2
      );
      const lerped = prev + (targetScrollIndex.current - prev) * lerpFactor;
      // Snap to integer if close enough
      if (Math.abs(lerped - targetScrollIndex.current) < 0.01)
        return targetScrollIndex.current;
      return lerped;
    });

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
      // Balance visibility for both forward and reverse scrolling
      const opacity =
        zIndex < -2 || zIndex > currentPodcasts.length - 2 ? 0 : 1;

      // Calculate lerp factor based on scroll velocity and direction
      const lerpFactor = Math.min(
        0.5, // Increased base lerp factor
        0.2 + Math.abs(scrollVelocity.current) * 0.2
      );

      // Add skew/rotation effect
      card.rotation.set(0, -0.2, 0);

      card.position.lerp(
        {
          x: isHovered ? 0.3 : -0.1,
          // x: isHovered ? 0 : -0.5 + zIndex * 0.3,
          y: -0,
          z: zOffset,
        },
        lerpFactor
      );

      // Update material opacity
      if (card.material) {
        card.material.opacity = opacity;
      }
    });
  });

  // Add useEffect to detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical tablet/mobile breakpoint
    };

    checkMobile(); // Check on initial render
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
          onClick={(e) => {
            e.stopPropagation();
            if (clickDisabled) {
              console.log("Click ignored: cooldown active");
              return;
            }
            setClickDisabled(true);
            const lockedIndex = i;
            const podcast = currentPodcasts[lockedIndex];
            setTimeout(() => setClickDisabled(false), 3000);
            console.log(
              "Navigating to:",
              podcast.company,
              "at index",
              lockedIndex
            );
            router.push(`/${slugify(podcast.company, { lower: true })}`);
          }}
        >
          <Image
            ref={(el: CardElement | null) => {
              cardsRef.current[i] = el;
            }}
            transparent
            opacity={1}
            scale={[0.7, 0.7, 0.7]}
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
                  color: "white",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                  transform: "translateY(-100%)",
                  pointerEvents: "none",
                  textTransform: "uppercase",
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

export default WebView;
