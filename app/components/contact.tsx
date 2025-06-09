import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";

export default function Contact({ onClose }: { onClose: () => void }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    gsap.set(container, { opacity: 0 });

    requestAnimationFrame(() => {
      gsap.to(container, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.inOut",
      });
    });

    return () => {
      if (container) {
        gsap.killTweensOf(container);
      }
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
        className="gap-2 flex justify-center items-center flex-wrap"
        onClick={(e) => e.stopPropagation()}
      >
        <Link href="mailto:hi@cryptotown.co" target="_blank">
          <button className="text-xs uppercase flex w-fit bg-gray-100/30 border border-gray-200/30 text-black/30 items-start gap-x-[2px] rounded-[0.375rem] px-4 py-2 hover:text-black transition-colors duration-200">
            hi@cryptotown.co
          </button>
        </Link>
        <Link href="https://www.youtube.com/@CryptoTownCo" target="_blank">
          <button className="text-xs uppercase flex w-fit bg-gray-100/30 border border-gray-200/30 text-black/30 items-start gap-x-[2px] rounded-full px-4 py-2 hover:text-black transition-colors duration-200">
            YouTube
          </button>
        </Link>
        <Link href="https://x.com/cryptotownco" target="_blank">
          <button className="text-xs uppercase flex w-fit bg-gray-100/30 border border-gray-200/30 text-black/30 items-start gap-x-[2px] rounded-full px-4 py-2 hover:text-black transition-colors duration-200">
            Twitter
          </button>
        </Link>
        <Link href="https://pods.media/crypto-town" target="_blank">
          <button className="text-xs uppercase flex w-fit bg-gray-100/30 border border-gray-200/30 text-black/30 items-start gap-x-[2px] rounded-[0.375rem] px-4 py-2 hover:text-black transition-colors duration-200">
            Pods Media
          </button>
        </Link>
      </div>
    </div>
  );
}
