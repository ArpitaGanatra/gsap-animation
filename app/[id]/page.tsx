"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import slugify from "slugify";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CompanyData } from "../api/companies/route";
import { EpisodeData } from "../api/podcasts/route";

export default function CompanyDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeData[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/companies");
        const allCompanies = (await res.json()) as CompanyData[];
        const found = allCompanies.find(
          (item) => slugify(item.company, { lower: true }) === id
        );
        setCompanyData(found || null);

        if (found?.company) {
          const resEpisodes = await fetch(
            `/api/podcasts?company=${found.company}`
          );
          const episodes = (await resEpisodes.json()) as EpisodeData[];
          setEpisodes(episodes);
        } else {
          setEpisodes([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-bold mb-4">Not Found</h1>
        <p className="text-lg text-gray-500">No company found for this page.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background px-4 py-24">
      <div className="mb-12 flex flex-col md:flex-row md:items-start md:justify-between gap-8 border-b border-gray-200 pb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={companyData.image}
              alt={companyData.company}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {companyData.company}
              </h1>
              <p className="text-sm text-gray-500">{companyData.guest}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {companyData.category}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {episodes.length} Episodes
              </span>
            </div>
          </div>
        </div>
        {episodes[0]?.mintLink && (
          <Link
            href={episodes[0].mintLink}
            target="_blank"
            className="self-start md:self-center"
          >
            <Button className="w-fit rounded-full px-8 py-3 text-base font-semibold bg-black text-white hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md">
              Mint
            </Button>
          </Link>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full mt-4">
        {episodes.map((episode, index) => (
          <Link
            key={index}
            href={episode.link}
            className="flex flex-col gap-4 group"
            target="_blank"
          >
            <div className="relative overflow-hidden rounded-lg transition-all duration-200">
              <Image
                src={episode.thumbnail}
                alt={`${companyData?.company} thumbnail ${index + 1}`}
                width={600}
                height={275}
                className="w-full rounded-lg h-[300px] max-w-[600px] object-cover transform group-hover:scale-[1.02] transition-transform duration-200"
              />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs font-medium text-gray-600 tracking-wide group-hover:text-gray-900 transition-colors">
                {episode.topic}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
