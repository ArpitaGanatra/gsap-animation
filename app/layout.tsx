import SplashScreen from "@/components/SplashScreen";
import Categories from "@/components/categories";
import Navbar from "@/components/navbar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AnimatedLogo from "./components/animated-logo";
import { CategoryProvider } from "./context/CategoryContext";
import "./globals.css";
import PosthogProvider from "@/lib/posthog-provider";
import { Toaster } from "sonner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crypotown",
  description: "a curated crypto network",
  icons: {
    icon: "/logos/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen`}
      >
        <Toaster />
        <PosthogProvider session={session}>
          <CategoryProvider>
            <SplashScreen />
            <AnimatedLogo />
            <Navbar />
            {children}
            <Categories />
          </CategoryProvider>
        </PosthogProvider>
      </body>
    </html>
  );
}
