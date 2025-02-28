"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="absolute left-0.5 bottom-0.5 z-20">
      <div className="fixed inset-0 bg-gradient-radial from-white/50 via-transparent to-transparent from-0% via-30% to-100% pointer-events-none bottom-0 left-0 bg-[radial-gradient(at_bottom_left,_var(--tw-gradient-stops))]" />
      <div className="fixed inset-0 bg-gradient-radial to-white/50 via-transparent from-transparent from-0% via-30% to-100% pointer-events-none top-0 right-0 -z-10 bg-[radial-gradient(at_bottom_left,_var(--tw-gradient-stops))]" />

      <div className="flex items-center gap-0.5 p-0.5">
        <button
          onClick={() => router.push("/")}
          className={`z-20 button text-[10px] uppercase flex w-fit  border border-black/30 items-start gap-x-[2px] rounded-[0.375rem] p-4 py-3.5  text-black backdrop-blur-lg ${
            pathname === "/overview" ? "text-opacity-[1]" : "text-opacity-[0.3]"
          } hover:text-opacity-[1]`}
        >
          <span
            className={`text-black cursor-pointer hover:text-opacity-[1] ${
              pathname === "/" ? "text-opacity-[1]" : "text-opacity-[0.3]"
            }`}
          >
            Overview
          </span>
        </button>

        <button
          onClick={() => router.push("/index-page")}
          className={`button text-[10px] uppercase flex w-fit  border border-black/30 items-start gap-x-[2px] rounded-[0.375rem] p-4 py-3.5   text-black backdrop-blur-lg ${
            pathname === "/index" ? "text-opacity-[1]" : "text-opacity-[0.3]"
          } hover:text-opacity-[1]`}
        >
          <span
            className={`text-black cursor-pointer hover:text-opacity-[1] ${
              pathname === "/index" ? "text-opacity-[1]" : "text-opacity-[0.3]"
            }`}
          >
            Index
          </span>
        </button>
      </div>
    </div>
  );
}
