"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);

  if (!showSplash) return null;

  return (
    <div className="fixed inset-0 w-full h-full bg-white z-50 flex items-center justify-center">
      <video
        autoPlay
        muted
        playsInline
        className="w-[20%] h-[20%] object-contain"
        onEnded={() => setShowSplash(false)}
      >
        <source src="/logos/initial.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
