"use client";

import React from "react";
import { useCategory } from "@/app/context/CategoryContext";
import { podcastData } from "@/lib/podcast-data";
import { usePathname } from "next/navigation";

export default function Categories() {
  const { selectedCategory, setSelectedCategory } = useCategory();
  const pathname = usePathname();

  // Calculate counts
  const counts = {
    all: podcastData.length,
    founders: podcastData.filter((p) => p.category === "Founder").length,
    vcs: podcastData.filter((p) => p.category === "VC").length,
    operators: podcastData.filter((p) =>
      ["COO", "CEO", "Growth", "Ecosystem"].includes(p.category)
    ).length,
  };

  return (
    <div
      className={`${
        pathname === "/" ? "flex" : "hidden"
      } md:flex flex-col gap-0.5 items-end absolute bottom-0.5 right-0.5`}
    >
      {[
        { name: "All", count: counts.all, path: "/" },
        { name: "Founders", count: counts.founders, path: "/founders" },
        { name: "VCs", count: counts.vcs, path: "/vcs" },
        { name: "Operators", count: counts.operators, path: "/operators" },
        { name: "Dubai", count: 0, path: "/dubai" },
        { name: "NYC", count: 0, path: "/nyc" },
        { name: "SF", count: 0, path: "/sf" },
      ].map((category) => (
        <button
          key={category.name}
          onClick={() => setSelectedCategory(category.path)}
          className={`button uppercase flex items-start gap-x-[3px] rounded-full px-4 py-3 bg-gray-100 border border-gray-200 text-xs text-black ${
            selectedCategory === category.path
              ? "text-opacity-[1]"
              : "text-opacity-[0.3]"
          } hover:text-opacity-[1]`}
        >
          <span className="translate-y-[1px]">{category.name}</span>
          <small className="text-8 mt-[0px]">{category.count}</small>
        </button>
      ))}
    </div>
  );
}
