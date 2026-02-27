"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Tweet, TweetSkeleton } from "react-tweet";

// Add Twitter widget type declaration
declare global {
  interface Window {
    twttr: {
      widgets: {
        load: () => Promise<void>;
      };
    };
  }
}

const Highlights = () => {
  const [allHighlights, setAllHighlights] = useState<string[]>([]);

  useEffect(() => {
    async function fetchHighlights() {
      try {
        const res = await fetch("/api/highlights");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setAllHighlights(data);
      } catch (error) {
        console.error("Error fetching highlights:", error);
      }
    }
    fetchHighlights();
  }, []);

  const getTweetId = (tweetUrl: string) => {
    const url = new URL(tweetUrl);
    const path = url.pathname;
    const id = path.split("/").pop();
    return id;
  };

  return (
    // <div className="flex flex-col min-h-screen bg-background px-4 py-32 md:py-24">
    <div className="flex flex-col min-h-screen w-full pt-[60px] md:pt-[100px] absolute inset-0  p-1 overflow-y-auto ">
      <div className="flex flex-col min-h-screen w-full pt-[60px] md:pt-[100px] absolute inset-0  p-1 overflow-y-auto ">
  {/* CryptoTown Tagline */}
  <div className="container mx-auto mb-8 px-4">
    <p className="text-[.8rem]/[1.2rem] md:text-[1rem]/[1.5rem] tracking-[.015em] text-center opacity-70">
      Conversations with investors managing <strong>$10B+</strong> in AUM
      <br />
      Founders building companies valued at <strong>$5B+</strong>
    </p>
  </div>
  <div className="flex flex-wrap gap-8 container mx-auto">
      <div className="flex flex-wrap gap-8 container mx-auto">
        {allHighlights.map((tweetUrl, index) => (
          <div
            key={index}
            className="flex-1 md:min-w-[450px] md:max-w-[600px] group"
            data-theme="light"
          >
            <Suspense fallback={<TweetSkeleton />}>
              <Tweet id={getTweetId(tweetUrl) as string} />
            </Suspense>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Highlights;
