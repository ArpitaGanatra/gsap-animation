"use client";

import Image from "next/image";
import React from "react";

export default function Rsdnts() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center  text-white ">
      <div className="max-w-2xl w-full px-8  md:px-12 bg-white/5 items-center flex flex-col  text-center">
        <Image src="/rsdnts.png" alt="rsdnts" width={300} height={300} />
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent tracking-tight py-8 leading-tight">
          Coming Soon
        </h1>
      </div>
    </div>
  );
}
