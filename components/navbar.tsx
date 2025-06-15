"use client";

import Contact from "@/app/components/contact";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center gap-0.5 absolute left-0.5 top-0.5 right-0.5 w-full pr-1">
        <button
          onClick={() => {
            setIsOpen(false);
            router.push("/");
          }}
          className={`z-20 button text-[10px] uppercase flex w-full md:w-fit items-start gap-x-[2px] rounded-[0.375rem] pl-2.5 pr-10 py-2 pt-10 text-black 
          backdrop-blur-[16px] backdrop-saturate-[180%] bg-[#F2F2F2]/40 border border-[#D3D3D3]/50 hover:bg-[#F2F2F2]/50 transition-all duration-300 
          ${
            !isOpen && pathname === "/"
              ? "text-opacity-[1] bg-[#F2F2F2]/50"
              : "text-opacity-[0.3]"
          } hover:text-opacity-[1]`}
        >
          <span
            className={`text-black cursor-pointer hover:text-opacity-[1] ${
              !isOpen && pathname === "/"
                ? "text-opacity-[1]"
                : "text-opacity-[0.3]"
            }`}
          >
            CryptoTown
          </span>
        </button>

        <button
          className={`z-20 button text-[10px] uppercase flex w-full md:w-fit items-start gap-x-[2px] rounded-[0.375rem] pl-2.5 pr-10 py-2 pt-10 text-black 
          backdrop-blur-[16px] backdrop-saturate-[180%] bg-[#F2F2F2]/40 border border-[#D3D3D3]/50 hover:bg-[#F2F2F2]/50 transition-all duration-300 
          ${
            isOpen ? "text-opacity-[1] bg-[#F2F2F2]/50" : "text-opacity-[0.3]"
          } hover:text-opacity-[1]`}
          onClick={() => {
            setIsOpen(false);
            router.push("/bangers");
          }}
        >
          Lore
        </button>

        <button
          onClick={() => {
            setIsOpen(false);
            router.push("/about");
          }}
          className={`z-20 button text-[10px] uppercase flex w-full md:w-fit items-start gap-x-[2px] rounded-[0.375rem] pl-2.5 pr-10 py-2 pt-10 text-black 
          backdrop-blur-[16px] backdrop-saturate-[180%] bg-[#F2F2F2]/40 border border-[#D3D3D3]/50 hover:bg-[#F2F2F2]/50 transition-all duration-300 
          ${
            !isOpen && pathname === "/about"
              ? "text-opacity-[1] bg-[#F2F2F2]/50"
              : "text-opacity-[0.3]"
          } hover:text-opacity-[1]`}
        >
          <span
            className={`text-black cursor-pointer hover:text-opacity-[1] ${
              !isOpen && pathname === "/about"
                ? "text-opacity-[1]"
                : "text-opacity-[0.3]"
            }`}
          >
            [rsdnts]
          </span>
        </button>

        <button
          className={`z-20 button text-[10px] uppercase flex w-full md:w-fit items-start gap-x-[2px] rounded-[0.375rem] pl-2.5 pr-10 py-2 pt-10 text-black 
          backdrop-blur-[16px] backdrop-saturate-[180%] bg-[#F2F2F2]/40 border border-[#D3D3D3]/50 hover:bg-[#F2F2F2]/50 transition-all duration-300 
          ${
            isOpen ? "text-opacity-[1] bg-[#F2F2F2]/50" : "text-opacity-[0.3]"
          } hover:text-opacity-[1]`}
          onClick={() => setIsOpen(true)}
        >
          Contact
        </button>
      </div>
      {isOpen && <Contact onClose={() => setIsOpen(false)} />}
    </>
  );
}
