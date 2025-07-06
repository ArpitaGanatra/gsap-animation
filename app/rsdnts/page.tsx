"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

interface ApplicationForm {
  name: string;
  telegram: string;
  twitter: string;
  proofOfWork: string;
  whyJoin: string;
  walletAddress: string;
}

interface TwitterUser {
  id: string;
  username: string;
  name: string;
  profile_image_url: string;
  verified: boolean;
  followers_count: number;
  following_count: number;
  tweet_count: number;
}

function RsdntsContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<TwitterUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ApplicationForm>({
    defaultValues: {
      name: "",
      telegram: "",
      twitter: "",
      proofOfWork: "",
      whyJoin: "",
      walletAddress: "",
    },
  });

  // Check for OAuth callback results
  useEffect(() => {
    const loginStatus = searchParams.get("login");
    const error = searchParams.get("error");

    if (loginStatus === "success") {
      checkUserSession();
    } else if (error) {
      console.error("Login error:", error);
      // You can show an error message here
    }
  }, [searchParams]);

  // Check if user is already logged in
  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/user");
      const data = await response.json();

      if (data.isLoggedIn) {
        setIsLoggedIn(true);
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error checking user session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ApplicationForm) => {
    try {
      // Handle form submission logic here
      console.log("Application submitted:", data);

      // You can add API call here
      // await submitApplication(data);

      // Reset form after successful submission
      reset();
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application. Please try again.");
    }
  };

  const handleTwitterLogin = () => {
    // Open Twitter OAuth in a new window to avoid CORS issues
    const authWindow = window.open(
      "/api/auth/twitter",
      "_blank",
      "width=600,height=700"
    );

    // Check if the window was blocked
    if (!authWindow) {
      alert("Please allow popups for this site to login with Twitter");
      return;
    }

    // Listen for messages from the popup
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "TWITTER_AUTH_SUCCESS") {
        authWindow.close();
        window.removeEventListener("message", handleMessage);
        checkUserSession();
      } else if (event.data.type === "TWITTER_AUTH_ERROR") {
        authWindow.close();
        window.removeEventListener("message", handleMessage);
        console.error("Twitter auth error:", event.data.error);
      }
    };

    window.addEventListener("message", handleMessage);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/user", { method: "DELETE" });
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden">
        {/* Background Pattern */}

        <div className="relative z-10 max-w-4xl mx-auto px-8 py-20">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="relative inline-block ">
              <Image
                src="/rsdnts.png"
                alt="rsdnts"
                width={100}
                height={100}
                className="mx-auto "
              />
            </div>
          </div>

          {/* Main Description */}
          <div className="">
            <div className="mb-8">
              <p className="text-md leading-relaxed space-y-3">
                <span className="block">
                  cryptotown is a highly curated network of people shaping the
                  future of crypto. but the town is incomplete without it&apos;s
                  residents.
                </span>
                <span className="block">
                  rsdnts are high agency founders, operators, content creators,
                  investors - the ones defining culture and building the town
                  block by block.
                </span>
                <span className="block">
                  if you&apos;ve been here, listening, learning, watching the
                  town grow, you&apos;re not just audience.
                  <span className="text-white font-medium">
                    you&apos;re building it too.
                  </span>
                </span>
                <span className="block">
                  [rsdnts] are the lifeline of cryptotown.
                  <br />
                  and the townhall is where stories, culture and opportunities
                  get passed on.
                </span>
              </p>
            </div>
          </div>

          {/* Who is eligible */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3 bg-gradient-to-r ">
              who is eligible
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center text-md text-black">
                <span className="w-2 h-2 bg-black rounded-full  mr-4"></span>
                devs
              </li>
              <li className="flex items-center text-md text-black">
                <span className="w-2 h-2 bg-black rounded-full mr-4"></span>
                content creators
              </li>
              <li className="flex items-center text-md text-black">
                <span className="w-2 h-2 bg-black rounded-full mr-4"></span>
                operators
              </li>
              <li className="flex items-center text-md text-black">
                <span className="w-2 h-2 bg-black rounded-full mr-4"></span>
                <Link
                  href="/"
                  className="text-black transition-colors underline  "
                >
                  minted atleast 1 cryptotown episode
                </Link>
              </li>
            </ul>
          </div>

          {/* What to expect */}
          <div className=" mb-8">
            <h2 className="text-xl font-bold mb-3">what to expect</h2>
            <ul className="space-y-4">
              <li className="flex items-center text-md text-black">
                <span className="w-2 h-2 bg-black rounded-full mr-4"></span>
                exclusive access to the cryptotown network and private events
              </li>
              <li className="flex items-center text-md text-black">
                <span className="w-2 h-2 bg-black rounded-full mr-4"></span>
                curated opportunities from across the industry
              </li>
              <li className="flex items-center text-md text-black">
                <span className="w-2 h-2 bg-black rounded-full mr-4"></span>
                alpha and behind-the-scenes of project narratives
              </li>
              <li className="flex items-center text-md text-black">
                <span className="w-2 h-2 bg-black rounded-full mr-4"></span>
                exposure to dealflow
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="p-10 mb-8">
              <p className="text-xl font-bold mb-4">
                apply to become a [rsdnt] to unlock exclusive access to
                cryptotown&apos;s network, private events and opportunities
              </p>
              <Button
                onClick={handleTwitterLogin}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-6 text-xl font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-blue-500/25"
              >
                <svg
                  className="w-6 h-6 mr-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                Login with Twitter
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged in state - Application form
  return (
    <div className="min-h-screen w-full text-black relative overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mt-16">
          <div className="relative inline-block mb-8">
            <Image
              src="/rsdnts.png"
              alt="rsdnts"
              width={120}
              height={120}
              className="mx-auto"
            />
          </div>
          <h1 className="text-xl md:text-6xl font-black tracking-tight mb-4">
            [rsdnt] Application
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join the most exclusive network in crypto
          </p>

          {/* User Info */}
          {user && (
            <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Image
                  src={user.profile_image_url}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="text-left">
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-gray-400">@{user.username}</p>
                  {user.verified && (
                    <span className="inline-flex items-center text-blue-500 text-sm">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-center space-x-6 text-sm text-gray-400">
                <span>{user.followers_count.toLocaleString()} followers</span>
                <span>{user.following_count.toLocaleString()} following</span>
                <span>{user.tweet_count.toLocaleString()} tweets</span>
              </div>
              <Button
                onClick={handleLogout}
                className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Application Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <label
                  htmlFor="name"
                  className="block text-lg font-semibold mb-3"
                >
                  1. Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  className={`w-full px-6 py-4 bg-white/10 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm ${
                    errors.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-600/50 focus:border-blue-500"
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="telegram"
                  className="block text-lg font-semibold mb-3"
                >
                  2. Telegram
                </label>
                <input
                  type="text"
                  id="telegram"
                  {...register("telegram", {
                    required: "Telegram username is required",
                    pattern: {
                      value: /^@?[a-zA-Z0-9_]{5,}$/,
                      message: "Please enter a valid Telegram username",
                    },
                  })}
                  className={`w-full px-6 py-4 bg-white/10 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm ${
                    errors.telegram
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-600/50 focus:border-blue-500"
                  }`}
                  placeholder="@username"
                />
                {errors.telegram && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.telegram.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="twitter"
                  className="block text-lg font-semibold mb-3"
                >
                  3. Twitter/X
                </label>
                <input
                  type="text"
                  id="twitter"
                  {...register("twitter", {
                    required: "Twitter username is required",
                    pattern: {
                      value: /^@?[a-zA-Z0-9_]{1,15}$/,
                      message: "Please enter a valid Twitter username",
                    },
                  })}
                  className={`w-full px-6 py-4 bg-white/10 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm ${
                    errors.twitter
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-600/50 focus:border-blue-500"
                  }`}
                  placeholder="@username"
                />
                {errors.twitter && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.twitter.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="proofOfWork"
                  className="block text-lg font-semibold mb-3"
                >
                  4. Proof of Work (something you&apos;re proud of)
                </label>
                <textarea
                  id="proofOfWork"
                  {...register("proofOfWork", {
                    required: "Proof of work is required",
                    minLength: {
                      value: 50,
                      message: "Please provide at least 50 characters",
                    },
                  })}
                  rows={4}
                  className={`w-full px-6 py-4 bg-white/10 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm resize-none ${
                    errors.proofOfWork
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-600/50 focus:border-blue-500"
                  }`}
                  placeholder="Share a project, achievement, or contribution you're proud of..."
                />
                {errors.proofOfWork && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.proofOfWork.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="whyJoin"
                  className="block text-lg font-semibold mb-3"
                >
                  5. Why do you want to join CryptoTown?
                </label>
                <textarea
                  id="whyJoin"
                  {...register("whyJoin", {
                    required: "This field is required",
                    minLength: {
                      value: 50,
                      message: "Please provide at least 50 characters",
                    },
                  })}
                  rows={4}
                  className={`w-full px-6 py-4 bg-white/10 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm resize-none ${
                    errors.whyJoin
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-600/50 focus:border-blue-500"
                  }`}
                  placeholder="Tell us why you want to be part of the cryptotown community..."
                />
                {errors.whyJoin && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.whyJoin.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="walletAddress"
                  className="block text-lg font-semibold mb-3"
                >
                  6. Wallet address (mint atleast 1 cryptotown episode to be
                  eligible)
                </label>
                <input
                  type="text"
                  id="walletAddress"
                  {...register("walletAddress", {
                    required: "Wallet address is required",
                    pattern: {
                      value: /^0x[a-fA-F0-9]{40}$/,
                      message: "Please enter a valid Ethereum wallet address",
                    },
                  })}
                  className={`w-full px-6 py-4 bg-white/10 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm ${
                    errors.walletAddress
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-600/50 focus:border-blue-500"
                  }`}
                  placeholder="0x..."
                />
                {errors.walletAddress && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.walletAddress.message}
                  </p>
                )}
                <p className="text-sm text-gray-400 mt-3 flex items-center">
                  <Link
                    href="/"
                    className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-blue-400/30 hover:decoration-blue-300"
                  >
                    Mint a cryptotown episode
                  </Link>
                  <span className="ml-2">to be eligible</span>
                </p>
              </div>

              <div className="pt-8">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-6 text-xl font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Rsdnts() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <RsdntsContent />
    </Suspense>
  );
}
