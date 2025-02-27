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
      <div className="flex items-center gap-0.5 absolute left-0.5 top-0.5">
        <button
          onClick={() => {
            setIsOpen(false);
            router.push("/");
          }}
          className={`z-20 button text-[10px] uppercase flex w-fit bg-gray-100 border border-gray-200 items-start gap-x-[2px] rounded-[0.375rem] pl-2.5 pr-10 py-2 pt-10 text-black ${
            !isOpen && pathname === "/"
              ? "text-opacity-[1]"
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
          onClick={() => {
            setIsOpen(false);
            router.push("/about");
          }}
          className={`z-20 button text-[10px] uppercase flex w-fit bg-gray-100 border border-gray-200 items-start gap-x-[2px] rounded-[0.375rem] pl-2.5 pr-10 py-2 pt-10 text-black ${
            !isOpen && pathname === "/about"
              ? "text-opacity-[1]"
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
            About
          </span>
        </button>
        <button
          className={`z-20 button text-[10px] uppercase flex w-fit bg-gray-100 border border-gray-200 items-start gap-x-[2px] rounded-[0.375rem] pl-2.5 pr-10 py-2 pt-10 text-black ${
            isOpen ? "text-opacity-[1]" : "text-opacity-[0.3]"
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
