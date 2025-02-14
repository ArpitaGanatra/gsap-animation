"use client";

import Contact from "@/app/components/contact";
import React, { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-0.5 absolute left-0.5 top-0.5">
        <button className="z-20 button text-xs uppercase flex w-fit bg-gray-100 border border-gray-200 items-start gap-x-[2px] rounded-[0.375rem] pl-2.5 pr-10 py-2 pt-10">
          CryptoTown
        </button>
        <button className="z-20 button text-xs uppercase flex w-fit bg-gray-100 border border-gray-200 items-start gap-x-[2px] rounded-[0.375rem] pl-2.5 pr-10 py-2 pt-10">
          About
        </button>
        <button
          className="z-20 button text-xs uppercase flex w-fit bg-gray-100 border border-gray-200 items-start gap-x-[2px] rounded-[0.375rem] pl-2.5 pr-10 py-2 pt-10"
          onClick={() => setIsOpen(true)}
        >
          Contact
        </button>
      </div>
      {isOpen && <Contact onClose={() => setIsOpen(false)} />}
    </>
  );
}
