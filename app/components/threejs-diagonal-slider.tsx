"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeDiagonalSliderProps {
  items?: number;
  offset?: number;
  colors?: string[];
}

export const ThreeDiagonalSlider = ({
  items = 100,
  offset = 150,
  colors = [
    "#fb7185", // rose-400
    "#a78bfa", // violet-400
    "#fbbf24", // amber-400
    "#34d399", // emerald-400
    "#22d3ee", // cyan-400
    "#a855f7", // purple-400
    "#ec4899", // pink-400
    "#818cf8", // indigo-400
    "#60a5fa", // blue-400
    "#2dd4bf", // teal-400
    "#4ade80", // green-400
    "#facc15", // yellow-400
    "#fb923c", // orange-400
    "#f87171", // red-400
    "#e879f9", // fuchsia-400
    "#38bdf8", // sky-400
    "#a3e635", // lime-400
  ],
}: ThreeDiagonalSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cardsRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const cards = cardsRef.current;
    if (!container) return;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );
    camera.position.z = 500;
    camera.position.y = 2000;
    // camera.position.x = 2000;
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create cards - Increased dimensions from 600x400 to 800x600
    const geometry = new THREE.PlaneGeometry(800, 600);

    for (let i = 0; i < items; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
      });

      const card = new THREE.Mesh(geometry, material);

      // Adjusted initial position to account for larger cards
      card.position.x = window.innerWidth - (200 + offset * i);
      card.position.y = -400 - offset * i;
      card.position.z = -500 - i * 10;

      // Rotate cards slightly
      card.rotation.x = THREE.MathUtils.degToRad(10);
      card.rotation.y = THREE.MathUtils.degToRad(-50);

      scene.add(card);
      cardsRef.current.push(card);
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle scroll
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scrollAmount = e.deltaY / 1000;
      progressRef.current += scrollAmount;

      if (progressRef.current < 0) {
        progressRef.current = items - (Math.abs(progressRef.current) % items);
      }
      progressRef.current = progressRef.current % items;

      // Update card positions
      cardsRef.current.forEach((card, index) => {
        const adjustedIndex = (index - progressRef.current + items) % items;
        const newY = -400 - offset * adjustedIndex;

        const isVisible = newY > -2000;
        const shouldReposition = newY < -2000;

        const targetY = shouldReposition ? 800 : newY;
        const targetX = window.innerWidth - (200 + offset * adjustedIndex);
        const targetZ = -500 - adjustedIndex * 10;

        card.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.1);

        (card.material as THREE.MeshBasicMaterial).opacity = isVisible
          ? 0.9
          : 0;
      });
    };

    container.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
      window.removeEventListener("resize", handleResize);

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      if (cards) {
        cards.forEach((card) => {
          scene.remove(card);
          card.geometry.dispose();
          (card.material as THREE.MeshBasicMaterial).dispose();
        });
      }
    };
  }, [items, offset, colors]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-black"
    />
  );
};
