"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import slugify from "slugify";
import Link from "next/link";
import { CompanyData } from "../api/companies/route";
import { EpisodeData } from "../api/podcasts/route";

function getYouTubeVideoId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function hasPublishedAt(obj: unknown): obj is { publishedAt: string } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "publishedAt" in obj &&
    typeof (obj as { publishedAt: unknown }).publishedAt === "string"
  );
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
      {/* Header Section */}
      <section className="max-w-2xl mx-auto px-4 py-12 text-center  rounded-xl  bg-white/80">
        <Image
          src={companyData.image}
          alt={companyData.company}
          width={80}
          height={80}
          className="rounded-lg mb-4 mx-auto"
        />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          {companyData.guest}{" "}
          <span className="text-gray-400 font-normal">|</span>{" "}
          {companyData.company}
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          {"intro" in companyData && typeof companyData.intro === "string"
            ? companyData.intro
            : "He built first modular AI chain. Let's see what he's up to now. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."}
        </p>

        <hr className="my-4 border-gray-200" />
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
            {episodes.length} Videos
          </span>
          <div className="flex flex-col items-center text-sm text-gray-400 justify-center">
            <span>by cryptotown</span>
          </div>
          <span className="h-4 border-l border-gray-300"></span>
          <span className="text-gray-500">
            Publised at:{" "}
            {episodes[0] && hasPublishedAt(episodes[0])
              ? new Date(episodes[0].publishedAt).toLocaleDateString()
              : "30 May 2025"}
          </span>
        </div>
      </section>

      {/* Videos Section */}
      <div className="grid md:grid-cols-2 container mx-auto gap-8 w-full mt-4">
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
