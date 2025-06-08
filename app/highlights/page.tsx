"use client";

import React, { useEffect } from "react";
import Script from "next/script";

// Add Twitter widget type declaration
declare global {
  interface Window {
    twttr: {
      widgets: {
        load: () => void;
      };
    };
  }
}

const Highlights = () => {
  useEffect(() => {
    // Reload Twitter widgets when component mounts
    if (window.twttr) {
      window.twttr.widgets.load();
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background px-4 py-24">
      <div className="grid md:grid-cols-2 container mx-auto gap-8 w-full">
        {/* Twitter Post 1 */}
        <div className="flex flex-col gap-3 group">
          <div className="relative rounded-lg transition-all duration-200">
            <blockquote
              className="twitter-tweet"
              data-theme="light"
              data-conversation="none"
            >
              <a href="https://twitter.com/sharvilmalik/status/1921191790809383129"></a>
            </blockquote>
          </div>
          <div className="flex flex-col gap-2 p-3 rounded-lg"></div>
        </div>

        {/* Twitter Post 2 */}
        <div className="flex flex-col gap-3 group">
          <div className="relative rounded-lg transition-all duration-200">
            <blockquote
              className="twitter-tweet"
              data-theme="light"
              data-conversation="none"
            >
              <a href="https://twitter.com/sharvilmalik/status/1915414065918460254"></a>
            </blockquote>
          </div>
          <div className="flex flex-col gap-2 p-3 rounded-lg"></div>
        </div>
        <div className="flex flex-col gap-3 group">
          <div className="relative rounded-lg transition-all duration-200">
            <blockquote
              className="twitter-tweet"
              data-theme="light"
              data-conversation="none"
            >
              <a href="https://twitter.com/sharvilmalik/status/1904984507763323137"></a>
            </blockquote>
          </div>
          <div className="flex flex-col gap-2 p-3 rounded-lg"></div>
        </div>
        <div className="flex flex-col gap-3 group">
          <div className="relative rounded-lg transition-all duration-200">
            <blockquote
              className="twitter-tweet"
              data-theme="light"
              data-conversation="none"
            >
              <a href="https://twitter.com/sharvilmalik/status/1902010725297525012"></a>
            </blockquote>
          </div>
          <div className="flex flex-col gap-2 p-3 rounded-lg"></div>
        </div>
      </div>

      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
      />
    </div>
  );
};

export default Highlights;
