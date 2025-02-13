"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const HorizontalScrollCarousel = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const totalWidth = container.scrollWidth; // Total width of horizontal container
    const viewportWidth = window.innerWidth; // Visible screen width

    gsap.to(container, {
      x: () => -(totalWidth - viewportWidth), // Move left to reveal content
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${totalWidth - viewportWidth}`, // Match scroll distance
        pin: true, // Keep section pinned during scroll
        scrub: 1, // Smooth effect
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div className="relative w-full h-screen">
      {/* Horizontal Scrolling Container */}
      <div
        ref={containerRef}
        className="flex h-full w-[500vw]" // Width should be 100vw * number of slides
      >
        {["blue", "red", "orange", "purple", "green"].map((color, index) => (
          <section
            key={index}
            className={`w-screen h-full flex items-center justify-center bg-${color}-500 text-white text-4xl`}
          >
            Slide {index + 1}
          </section>
        ))}
      </div>
    </div>
  );
};

export default HorizontalScrollCarousel;
