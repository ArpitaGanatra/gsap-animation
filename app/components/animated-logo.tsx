"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AnimatedLogo() {
  // useEffect(() => {
  //   if (pathname === "/about") {
  //     gsap.set(logoRef.current, {
  //       transformOrigin: "top right",
  //       scale: 1, // Ensure it starts at normal size
  //     });

  //     gsap.to(logoRef.current, {
  //       scale: 6, // Scale up to 1.5 and STAY there
  //       duration: 1,
  //       ease: "back.out(1.7)",
  //       delay: 0.3,
  //     });
  //   } else {
  //     gsap.to(logoRef.current, {
  //       scale: 1, // Scale back to normal
  //       duration: 0.5,
  //       ease: "power2.out",
  //     });
  //   }
  // }, [pathname]);
  const pathname = usePathname();

  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/about")
      .then((res) => res.json())
      .then((data) => setLogo(data.image));
  }, []);

  if (pathname === "/about") {
    return (
      <div className="hidden md:block absolute top-1 right-1 z-30">
        <Image src={logo || ""} alt="logo" width={360} height={360} />
      </div>
    );
  }
  return (
    <div className="hidden md:block absolute top-1 right-5 z-30 invert">
      <Image src="/logo-no-bg.png" alt="logo" width={80} height={80} />
    </div>
  );
}
