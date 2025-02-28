"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { usePathname } from "next/navigation";

export default function AnimatedLogo() {
  const pathname = usePathname();
  const logoRef = useRef(null);

  useEffect(() => {
    if (pathname === "/about") {
      gsap.set(logoRef.current, {
        transformOrigin: "top right",
        scale: 1, // Ensure it starts at normal size
      });

      gsap.to(logoRef.current, {
        scale: 6, // Scale up to 1.5 and STAY there
        duration: 1,
        ease: "back.out(1.7)",
        delay: 0.3,
      });
    } else {
      gsap.to(logoRef.current, {
        scale: 1, // Scale back to normal
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [pathname]);

  return (
    <div ref={logoRef} className="absolute top-1 right-1 z-30">
      <Image src="/logo.png" alt="logo" width={60} height={60} />
    </div>
  );
}
