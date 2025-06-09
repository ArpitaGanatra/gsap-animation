"use client";
// import { ThreeDiagonalSlider } from "./components/threejs-diagonal-slider";
import { useRouter } from "next/navigation";
import { useCategory } from "../context/CategoryContext";
import { useEffect } from "react";
import { useState } from "react";
import { CompanyData } from "../api/companies/route";

export default function About() {
  const router = useRouter();
  const { setSelectedCategory } = useCategory();

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
      <section className="flex w-full flex-col gap-y-5 mt-[125px] absolute inset-0 sm:max-w-[27rem] p-1 overflow-y-auto">
        <p className="text-[.65625rem]/[.8125rem] tracking-[.015em] mb-5 normal-case">
          CryptoTown is a fun and candid show featuring tier 1 founders, VCs,
          and operators. We dive into unhinged stories of crypto&apos;s most
          influential figures, uncovering what worked for them - and what you
          can learn from them.
        </p>
        <section>
          <ul
            className="text-[.65625rem]/[.8125rem] tracking-[.015em] opacity-0"
            style={{ opacity: "1" }}
          >
            <li className="flex">
              <span
                className="leading-[1.25] opacity-30"
                style={{ width: "200px" }}
              >
                Guests
              </span>
              <section className="flex flex-col">
                {/* Group and render Founders */}
                <span className="leading-[1.25] opacity-30 mt-0 mb-2">
                  Founders
                </span>
                {podcastData
                  .filter((guest) => guest.category === "Founder")
                  .sort((a, b) => a.guest.localeCompare(b.guest))
                  .map((guest) => (
                    <span
                      key={`${guest.guest}-${guest.company}`}
                      className="leading-[1.25]"
                    >
                      {guest.guest} · {guest.company}
                    </span>
                  ))}

                {/* Group and render VCs */}
                <span className="leading-[1.25] opacity-30 mt-4 mb-2">VCs</span>
                {podcastData
                  .filter((guest) => guest.category === "VC")
                  .sort((a, b) => a.guest.localeCompare(b.guest))
                  .map((guest) => (
                    <span
                      key={`${guest.guest}-${guest.company}`}
                      className="leading-[1.25]"
                    >
                      {guest.guest} · {guest.company}
                    </span>
                  ))}

                {/* Group and render Others */}
                <span className="leading-[1.25] opacity-30 mt-4 mb-2">
                  Others
                </span>
                {podcastData
                  .filter(
                    (guest) => !["Founder", "VC"].includes(guest.category)
                  )
                  .sort((a, b) => a.guest.localeCompare(b.guest))
                  .map((guest) => (
                    <span
                      key={`${guest.guest}-${guest.company}`}
                      className="leading-[1.25]"
                    >
                      {guest.guest} · {guest.company} ({guest.category})
                    </span>
                  ))}
              </section>
            </li>
          </ul>
        </section>
        <ul
          className="text-[.65625rem]/[.8125rem] tracking-[.015em] opacity-0"
          style={{ opacity: "1" }}
        >
          <li className="flex">
            <span
              className="leading-[1.25] opacity-30"
              style={{ width: "200px" }}
            >
              Towns
            </span>
            <section className="flex flex-col">
              <span className="leading-[1.25]">Dubai</span>
              <span className="leading-[1.25]">NYC</span>
              <span className="leading-[1.25]">SF</span>
              <span className="leading-[1.25]">Denver</span>
            </section>
          </li>
        </ul>
        <ul className="mt-5 opacity-0" style={{ opacity: "1" }}>
          <li className="flex">
            <span
              className="text-[.65625rem]/[.8125rem] tracking-[.015em] leading-[1.25] opacity-30"
              style={{ width: "200px" }}
            >
              Profiles
            </span>
            <div className="flex flex-col items-start gap-y-0.5">
              <button
                className="uppercase flex items-start gap-x-[3px] rounded-full px-4 py-3 bg-gray-100 border border-gray-200 text-xs text-black text-opacity-[0.3] hover:text-opacity-[1]"
                type="button"
                onClick={() => {
                  setSelectedCategory("/founders");
                  router.push("/");
                }}
              >
                <span className="translate-y-[1px]">Founders</span>
                <small className="text-8 mt-[0px]">
                  {podcastData.filter((p) => p.category === "Founder").length}
                </small>
              </button>
              <button
                className="uppercase flex items-start gap-x-[3px] rounded-full px-4 py-3 bg-gray-100 border border-gray-200 text-xs text-black text-opacity-[0.3] hover:text-opacity-[1]"
                type="button"
                onClick={() => {
                  setSelectedCategory("/vcs");
                  router.push("/");
                }}
              >
                <span className="translate-y-[1px]">VCs</span>
                <small className="text-8 mt-[0px]">
                  {podcastData.filter((p) => p.category === "VC").length}
                </small>
              </button>
              <button
                className="uppercase flex items-start gap-x-[3px] rounded-full px-4 py-3 bg-gray-100 border border-gray-200 text-xs text-black text-opacity-[0.3] hover:text-opacity-[1]"
                type="button"
                onClick={() => {
                  setSelectedCategory("/operators");
                  router.push("/");
                }}
              >
                <span className="translate-y-[1px]">Operators</span>
                <small className="text-8 mt-[0px]">
                  {
                    podcastData.filter((p) =>
                      ["COO", "CEO", "Growth", "Ecosystem"].includes(p.category)
                    ).length
                  }
                </small>
              </button>
            </div>
          </li>
        </ul>
      </section>
    </>
  );
}
