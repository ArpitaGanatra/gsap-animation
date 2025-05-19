"use client";

import { useParams } from "next/navigation";
import { Playlist } from "@/playlist";
import Image from "next/image";
import React from "react";
import { podcastData } from "@/lib/podcast-data";
import slugify from "slugify";
import Link from "next/link";

export default function CompanyDetail() {
  const params = useParams();
  const id = params?.id as string;

  const data = podcastData.find(
    (item) => slugify(item.company, { lower: true }) === id
  );

  // Find the company data from Playlist
  const companyData = Playlist[data?.company as keyof typeof Playlist];
  console.log(
    data?.company,
    data?.guest,
    Playlist[data?.company as keyof typeof Playlist]
  );

  if (!companyData || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-bold mb-4">Not Found</h1>
        <p className="text-lg text-gray-500">No company found for this page.</p>
      </div>
    );
  }

  // Convert episodes object to array
  const episodes = Object.entries(companyData).map(([key, value]) => ({
    id: key,
    name: value.name,
    company: value.company,
    topic: value.topic,
    thumbnail: value.thumbnail,
    link: value.link,
  }));

  return (
    <div className="flex flex-col min-h-screen bg-background px-4 py-24">
      <span
        className="leading-[1.25] text-[.65625rem]/[.8125rem] "
        style={{ width: "200px" }}
      >
        Company: {data.company}
      </span>
      <span
        className="leading-[1.25] text-[.65625rem]/[.8125rem] "
        style={{ width: "200px" }}
      >
        Category: {data.category}
      </span>
      <span
        className="leading-[1.25] text-[.65625rem]/[.8125rem] "
        style={{ width: "200px" }}
      >
        Guest: {data.guest}
      </span>

      <div className="grid md:grid-cols-2 gap-8 w-full mt-4">
        {episodes.map((episode, index) => (
          <Link
            key={episode.id}
            href={episode.link}
            className="flex flex-col gap-4 "
            target="_blank"
          >
            <Image
              src={episode.thumbnail}
              alt={`${episode.company} thumbnail ${index + 1}`}
              width={600}
              height={400}
              className="w-full h-[300px] max-w-[600px] object-cover shadow-lg rounded-lg cursor-pointer"
            />
            <div className="flex flex-col gap-2">
              {/* <span className="text-[.65625rem]/[.8125rem]">
                Guest: {episode.name}
              </span> */}
              <span className="text-[.65625rem]/[.8125rem] flex flex-wrap w-full">
                Topic: {episode.topic}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
