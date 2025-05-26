"use client";

import { useCategory } from "@/app/context/CategoryContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllCompanies, CompanyData } from "@/lib/airtable";

export default function Categories() {
  const { selectedCategory, setSelectedCategory } = useCategory();
  const pathname = usePathname();
  const router = useRouter();

  const [podcastData, setPodcastData] = useState<CompanyData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getAllCompanies();
      setPodcastData(data);
    }
    fetchData();
  }, []);

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
        pathname === "/" || pathname === "/index-page" ? "flex" : "hidden"
      } flex md:flex-col gap-0.5 items-stretch md:items-end absolute left-1 z-[19] bottom-0.5 right-0.5 overflow-scroll `}
    >
      <button
        className={`md:hidden button rounded-lg px-3 py-2 backdrop-blur-[16px] backdrop-saturate-[180%] bg-[#F2F2F2]/40 border border-[#D3D3D3]/50 hover:bg-[#F2F2F2]/50 transition-all duration-300 text-xs text-black hover:text-opacity-[1]`}
        onClick={() => {
          if (pathname === "/index-page") {
            router.push("/");
          } else {
            router.push("/index-page");
          }
        }}
      >
        {pathname === "/index-page" ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.9498 8.46447C17.3404 8.07394 17.3404 7.44078 16.9498 7.05025C16.5593 6.65973 15.9261 6.65973 15.5356 7.05025L12.0001 10.5858L8.46455 7.05025C8.07402 6.65973 7.44086 6.65973 7.05033 7.05025C6.65981 7.44078 6.65981 8.07394 7.05033 8.46447L10.5859 12L7.05033 15.5355C6.65981 15.9261 6.65981 16.5592 7.05033 16.9497C7.44086 17.3403 8.07402 17.3403 8.46455 16.9497L12.0001 13.4142L15.5356 16.9497C15.9261 17.3403 16.5593 17.3403 16.9498 16.9497C17.3404 16.5592 17.3404 15.9261 16.9498 15.5355L13.4143 12L16.9498 8.46447Z"
                fill="#000000"
              ></path>{" "}
            </g>
          </svg>
        ) : (
          <svg
            fill="#000000"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 276.167 276.167"
            className="w-[10px] h-[10px]"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <g>
                <g>
                  <path d="M33.144,2.471C15.336,2.471,0.85,16.958,0.85,34.765s14.48,32.293,32.294,32.293s32.294-14.486,32.294-32.293 S50.951,2.471,33.144,2.471z"></path>{" "}
                  <path d="M137.663,2.471c-17.807,0-32.294,14.487-32.294,32.294s14.487,32.293,32.294,32.293c17.808,0,32.297-14.486,32.297-32.293 S155.477,2.471,137.663,2.471z"></path>{" "}
                  <path d="M243.873,67.059c17.804,0,32.294-14.486,32.294-32.293S261.689,2.471,243.873,2.471s-32.294,14.487-32.294,32.294 S226.068,67.059,243.873,67.059z"></path>{" "}
                  <path d="M32.3,170.539c17.807,0,32.297-14.483,32.297-32.293c0-17.811-14.49-32.297-32.297-32.297S0,120.436,0,138.246 C0,156.056,14.493,170.539,32.3,170.539z"></path>{" "}
                  <path d="M136.819,170.539c17.804,0,32.294-14.483,32.294-32.293c0-17.811-14.478-32.297-32.294-32.297 c-17.813,0-32.294,14.486-32.294,32.297C104.525,156.056,119.012,170.539,136.819,170.539z"></path>{" "}
                  <path d="M243.038,170.539c17.811,0,32.294-14.483,32.294-32.293c0-17.811-14.483-32.297-32.294-32.297 s-32.306,14.486-32.306,32.297C210.732,156.056,225.222,170.539,243.038,170.539z"></path>{" "}
                  <path d="M33.039,209.108c-17.807,0-32.3,14.483-32.3,32.294c0,17.804,14.493,32.293,32.3,32.293s32.293-14.482,32.293-32.293 S50.846,209.108,33.039,209.108z"></path>{" "}
                  <path d="M137.564,209.108c-17.808,0-32.3,14.483-32.3,32.294c0,17.804,14.487,32.293,32.3,32.293 c17.804,0,32.293-14.482,32.293-32.293S155.368,209.108,137.564,209.108z"></path>{" "}
                  <path d="M243.771,209.108c-17.804,0-32.294,14.483-32.294,32.294c0,17.804,14.49,32.293,32.294,32.293 c17.811,0,32.294-14.482,32.294-32.293S261.575,209.108,243.771,209.108z"></path>{" "}
                </g>
              </g>
            </g>
          </svg>
        )}
      </button>
      {[
        { name: "All", count: counts.all, path: "/" },
        { name: "Founders", count: counts.founders, path: "/founders" },
        { name: "VCs", count: counts.vcs, path: "/vcs" },
        // { name: "Operators", count: counts.operators, path: "/operators" },
        // { name: "Dubai", count: 0, path: "/dubai" },
        // { name: "NYC", count: 0, path: "/nyc" },
        // { name: "SF", count: 0, path: "/sf" },
      ].map((category) => (
        <button
          key={category.name}
          onClick={() => setSelectedCategory(category.path)}
          className={`button uppercase flex items-start gap-x-[3px] rounded-full px-4 py-3 text-xs text-black 
          backdrop-blur-[16px] backdrop-saturate-[180%] bg-[#F2F2F2]/40 border border-[#D3D3D3]/50 hover:bg-[#F2F2F2]/50 transition-all duration-300 
          ${
            selectedCategory === category.path
              ? "text-opacity-[1] bg-[#F2F2F2]/50"
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
