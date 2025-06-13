"use client";

import React, { useState, useEffect } from "react";
import { Tweet } from "react-tweet";

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
    <div className="flex flex-col min-h-screen bg-background px-4 py-24">
      <div className="flex flex-wrap gap-8 container mx-auto">
        {allHighlights.map((tweetUrl, index) => (
          <div
            key={index}
            className="flex-1 min-w-[450px] max-w-[600px] group"
            data-theme="light"
          >
            <Tweet id={getTweetId(tweetUrl) as string} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Highlights;
