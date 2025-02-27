"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HorizontalScrollCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const totalWidth = container.scrollWidth;
    const viewportWidth = window.innerWidth;

    gsap.to(container, {
      x: () => -(totalWidth - viewportWidth),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${totalWidth - viewportWidth}`,
        pin: true,
        scrub: 1,
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="flex h-full w-[500vw]">
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
