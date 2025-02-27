"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  // Remove splash screen after fade animation
  useEffect(() => {
    if (isVideoEnded) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 1000); // Wait for fade animation to complete
      return () => clearTimeout(timer);
    }
  }, [isVideoEnded]);

  if (!showSplash) return null;

  return (
    <div
      className={`fixed inset-0 w-full h-full bg-white z-50 flex items-center justify-center transition-opacity duration-1000 ease-out
      ${isVideoEnded ? "opacity-0" : "opacity-100"}`}
    >
      <video
        autoPlay
        muted
        playsInline
        className="w-[20%] h-[20%] object-contain"
        onEnded={() => setIsVideoEnded(true)}
      >
        <source src="/logos/initial.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
