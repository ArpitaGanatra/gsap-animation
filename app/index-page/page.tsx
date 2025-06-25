"use client";

import Link from "next/link";
import slugify from "slugify";
import { CompanyData } from "../api/companies/route";
import { useEffect } from "react";
import { useState } from "react";

export default function Index() {
  const [podcastData, setPodcastData] = useState<CompanyData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/companies");
      const data = await res.json();
      setPodcastData(data);
    }
    fetchData();
  }, []);

  return (
    <>
      <section className="text-[.65625rem]/[.8125rem] tracking-[.015em] absolute inset-0 mr-auto flex h-full w-full flex-col sm:py-0">
        <ul className="flex h-full flex-col items-start justify-start overflow-x-auto px-1 py-28 sm:py-[9rem]">
          <li className="mb-5 flex opacity-0" style={{ opacity: "1" }}>
            <span className="w-[120px] flex-shrink-0">GUEST</span>
            <span className="w-[170px] flex-shrink-0">COMPANY</span>
            <span className="w-[170px]">CATEGORY</span>
          </li>
          {podcastData.map((data) => {
            return (
              <li
                key={data.guest}
                className="flex opacity-0"
                style={{ opacity: "1" }}
              >
                <Link
                  href={`/${slugify(data.guest, {
                    lower: true,
                  }).replace(/-/g, "")}`}
                >
                  <div className="flex w-auto flex-shrink-0 py-[0.325rem] opacity-[0.3] hover:opacity-[1]">
                    <span className="w-[120px] flex-shrink-0">
                      {data.guest}
                    </span>
                    <span className="w-[170px] flex-shrink-0">
                      {data.company}
                    </span>
                    <span className="w-[170px] flex flex-shrink-0">
                      {data.category}
                    </span>
                  </div>
                  <div className="pointer-events-none w-[calc(80px)] flex-shrink-0 sm:hidden"></div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
