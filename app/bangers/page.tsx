"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Script from "next/script";

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

const BATCH_SIZE = 4;

const Highlights = () => {
  const [allHighlights, setAllHighlights] = useState<string[]>([]);
  const [displayedHighlights, setDisplayedHighlights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch all highlights
  useEffect(() => {
    async function fetchHighlights() {
      try {
        const res = await fetch("/api/highlights");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log("data", data);
        setAllHighlights(data);
        // Initially display first batch
        setDisplayedHighlights(data.slice(0, BATCH_SIZE));
        setHasMore(data.length > BATCH_SIZE);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching highlights:", error);
        setLoading(false);
      }
    }
    fetchHighlights();
  }, []);

  // Load more tweets when scrolling
  const loadMore = useCallback(() => {
    if (!hasMore) return;

    setDisplayedHighlights((prev) => {
      const nextBatch = allHighlights.slice(
        prev.length,
        prev.length + BATCH_SIZE
      );
      const newDisplayed = [...prev, ...nextBatch];
      setHasMore(newDisplayed.length < allHighlights.length);
      return newDisplayed;
    });
  }, [allHighlights, hasMore]);

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, hasMore, loading]);

  // Reload Twitter widgets when new tweets are loaded
  useEffect(() => {
    if (window.twttr && scriptLoaded && !loading) {
      window.twttr.widgets.load().catch(console.error);
    }
  }, [displayedHighlights, loading, scriptLoaded]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500">Loading highlights...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background px-4 py-24">
      <div className="flex flex-wrap gap-8 container mx-auto">
        {displayedHighlights.map((tweetUrl, index) => (
          <div key={index} className="flex-1 min-w-[450px] max-w-[600px] group">
            <div className="relative rounded-lg transition-all duration-200">
              <blockquote
                className="twitter-tweet"
                data-theme="light"
                data-conversation="none"
              >
                <a href={tweetUrl}></a>
              </blockquote>
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {hasMore && (
        <div
          ref={observerTarget}
          className="h-20 flex items-center justify-center mt-8"
        >
          <div className="animate-pulse text-gray-500">
            Loading more tweets...
          </div>
        </div>
      )}

      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
        onError={(e) => {
          console.error("Error loading Twitter widget script:", e);
          setScriptLoaded(false);
        }}
      />
    </div>
  );
};

export default Highlights;
