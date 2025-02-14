import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Contact({ onClose }: { onClose: () => void }) {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.set(containerRef.current, { opacity: 0 });

    requestAnimationFrame(() => {
      gsap.to(containerRef.current, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.inOut",
      });
    });

    return () => {
      gsap.killTweensOf(containerRef?.current);
    };
  }, []);

  const handleClose = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
      onComplete: onClose,
    });
  };

  return (
    <div
      ref={containerRef}
      className="absolute z-10 inset-0 w-screen h-screen backdrop-blur-xl flex justify-center items-center"
      onClick={handleClose}
    >
      <div
        className="gap-2 flex justify-center items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="text-xs uppercase flex w-fit bg-gray-100/30 border border-gray-200/30 text-black/30 items-start gap-x-[2px] rounded-[0.375rem] px-4 py-2 hover:text-black transition-colors duration-200">
          cryptotownpod@gmail.com
        </button>
        <button className="text-xs uppercase flex w-fit bg-gray-100/30 border border-gray-200/30 text-black/30 items-start gap-x-[2px] rounded-full px-4 py-2 hover:text-black transition-colors duration-200">
          Instagram
        </button>
        <button className="text-xs uppercase flex w-fit bg-gray-100/30 border border-gray-200/30 text-black/30 items-start gap-x-[2px] rounded-full px-4 py-2 hover:text-black transition-colors duration-200">
          Twitter
        </button>
        <button className="text-xs uppercase flex w-fit bg-gray-100/30 border border-gray-200/30 text-black/30 items-start gap-x-[2px] rounded-[0.375rem] px-4 py-2 hover:text-black transition-colors duration-200">
          25, RUE HENREY MONNIER, 75010 PARIS
        </button>
      </div>
    </div>
  );
}
