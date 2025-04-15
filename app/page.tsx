"use client";

import MobileView from "./components/mobile-view";
import WebView from "./components/web-view";

const Home = () => {
  if (window.innerWidth < 768) {
    return <MobileView />;
  } else {
    return <WebView />;
  }
};

export default Home;
