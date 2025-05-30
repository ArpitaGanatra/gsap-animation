"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import slugify from "slugify";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CompanyData } from "../api/companies/route";
import { EpisodeData } from "../api/podcasts/route";

function getYouTubeVideoId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

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
                {companyData.guest}
              </h1>
              <p className="text-sm text-gray-500">
                Company: {companyData.company}
              </p>
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

      <div className="grid md:grid-cols-2 md:gap-x-40 gap-8 w-full mt-4">
        {episodes.map((episode, index) => {
          const videoId = getYouTubeVideoId(episode.link);
          return (
            <div key={index} className="flex flex-col gap-3 group">
              <div className="relative overflow-hidden aspect-video rounded-lg transition-all duration-200 shadow-md group-hover:shadow-lg ">
                {videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={`${companyData?.company} episode ${index + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-lg items-start"
                  />
                ) : (
                  <Link href={episode.link} target="_blank">
                    <div className="relative w-full h-full">
                      <Image
                        src={episode.thumbnail}
                        alt={`${companyData?.company} thumbnail ${index + 1}`}
                        fill
                        className="rounded-lg object-cover transform group-hover:scale-[1.02] transition-transform duration-200"
                      />
                    </div>
                  </Link>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-600 tracking-wide group-hover:text-gray-900 transition-colors line-clamp-2">
                  {episode.topic}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
