"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface DiagonalSliderProps {
  items?: number;
  offset?: number;
  colors?: string[];
}

export const DiagonalSlider = ({
  items = 25,
  offset = 100,
  colors = [
    "bg-rose-400/90",
    "bg-violet-400/90",
    "bg-amber-400/90",
    "bg-emerald-400/90",
    "bg-cyan-400/90",
    "bg-cyan-400/90",
    "bg-purple-400/90",
    "bg-pink-400/90",
    "bg-indigo-400/90",
    "bg-blue-400/90",
    "bg-teal-400/90",
    "bg-green-400/90",
    "bg-yellow-400/90",
    "bg-orange-400/90",
    "bg-red-400/90",
    "bg-fuchsia-400/90",
    "bg-sky-400/90",
    "bg-lime-400/90",
    "bg-emerald-500/90",
    "bg-violet-500/90",
    "bg-rose-500/90",
    "bg-amber-500/90",
    "bg-cyan-500/90",
    "bg-indigo-500/90",
    "bg-purple-500/90",
    "bg-pink-500/90",
  ],
}: DiagonalSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const progressRef = useRef(0);

  console.log("offset", offset);

  useEffect(() => {
    if (!sliderRef.current) return;
    const sliderItems = itemsRef.current;
    const totalItems = sliderItems.length;

    // Initial positions - starting from bottom-left to top-right
    gsap.set(sliderItems, {
      x: (index) => 100 + offset * index,
      y: (index) => window.innerHeight - 300 - offset * index,
      zIndex: (index) => totalItems - index - 500,
      opacity: (index) => {
        // Show cards that are within visible range
        const yPos = window.innerHeight - 300 - offset * index;

        return yPos > -400 && yPos < window.innerHeight ? 1 : 0;
      },
    });

    const updatePositions = (progress: number) => {
      sliderItems.forEach((item, index) => {
        const adjustedIndex = (index - progress + totalItems) % totalItems;
        const newY = window.innerHeight - 300 - offset * adjustedIndex;

        // Calculate opacity based on progress value
        // A card should disappear when progress is 3 positions ahead of its index
        console.log(progress - index + totalItems, totalItems);
        const isVisible =
          (progress - index + totalItems) % totalItems <= totalItems;

        // Adjust repositioning threshold
        const shouldReposition = newY < -5800;

        gsap.to(item, {
          x: 100 + offset * adjustedIndex,
          y: shouldReposition ? window.innerHeight + 400 : newY,
          zIndex: totalItems - adjustedIndex - 500,
          opacity: isVisible ? 1 : 0,
          duration: 0.8,
          ease: "power2.out",
        });
      });
    };

    const handleWheel = (e: WheelEvent) => {
      // Prevent default scroll behavior
      e.preventDefault();

      // Convert mouse wheel delta to a smaller value for smoother scrolling
      // deltaY is divided by 1000 to make the scroll amount smaller and more controllable
      const scrollAmount = e.deltaY / 1000;

      // Update the progress counter based on scroll amount
      progressRef.current += scrollAmount;

      console.log("progressRef", progressRef, scrollAmount);

      // Handle negative scroll (scrolling up)
      // If progress goes below 0, wrap around to the end of the items
      if (progressRef.current < 0) {
        progressRef.current =
          totalItems - (Math.abs(progressRef.current) % totalItems);
      }

      // Keep progress within bounds of total items using modulo
      progressRef.current = progressRef.current % totalItems;

      // Update the positions of all items based on new progress value
      updatePositions(progressRef.current);
    };

    const sliderElement = sliderRef.current;
    sliderElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      sliderElement.removeEventListener("wheel", handleWheel);
      sliderItems.forEach((item) => {
        gsap.killTweensOf(item);
      });
    };
  }, [offset]);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
      <div ref={sliderRef} className="absolute inset-0">
        {Array.from({ length: items }).map((_, index) => (
          <div
            key={index}
            ref={(el) => el && (itemsRef.current[index] = el)}
            className={`absolute w-[600px] h-[400px] flex justify-center items-center
              ${colors[index % colors.length]} 
              backdrop-blur-sm rounded-2xl shadow-lg 
              border border-white/10`}
            style={{
              perspective: "1000px",
              transform: "rotateX(10deg) rotateY(50deg)",
            }}
          >
            {/* Add your content here */}
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};
