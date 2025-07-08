"use client";

import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import { RiTwitterXLine } from "react-icons/ri";
import { useRouter } from "next/navigation";

interface ApplicationForm {
  name: string;
  telegram: string;
  twitter: string;
  proofOfWork: string;
  walletAddress: string;
}

function RsdntsContent() {
  const { status, data: session } = useSession();
  const posthog = usePostHog();
  const router = useRouter();
  const [nftStatus, setNftStatus] = useState<
    "idle" | "checking" | "hasNFT" | "noNFT" | "error"
  >("idle");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ApplicationForm>({
    defaultValues: {
      name: "",
      telegram: "",
      twitter: "",
      proofOfWork: "",
      walletAddress: "",
    },
  });

  const walletAddress = watch("walletAddress");

  async function checkNFTOwnership(walletAddress: string) {
    try {
      console.log(`Checking NFT ownership for wallet: ${walletAddress}`);

      // Call our secure server-side API endpoint
      const response = await fetch("/api/check-nft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to check NFT ownership");
      }

      console.log("NFT check response:", data);
      return data.hasNFT;
    } catch (error) {
      console.error("Error checking NFT ownership:", error);
      throw error;
    }
  }

  // Effect to check NFT ownership when wallet address changes
  useEffect(() => {
    const checkNFT = async () => {
      if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        setNftStatus("idle");
        return;
      }

      setNftStatus("checking");

      try {
        const hasNFT = await checkNFTOwnership(walletAddress);
        setNftStatus(hasNFT ? "hasNFT" : "noNFT");
      } catch {
        setNftStatus("error");
      }
    };

    const timeoutId = setTimeout(checkNFT, 1000); // Debounce for 1 second
    return () => clearTimeout(timeoutId);
  }, [walletAddress]);

  const onSubmit = async (data: ApplicationForm) => {
    try {
      console.log("Submitting application:", data);

      // Submit to our API endpoint
      const response = await fetch("/api/submit-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          telegram: data.telegram,
          twitter: data.twitter,
          walletAddress: data.walletAddress,
          proofOfWork: data.proofOfWork,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      console.log("Application submitted successfully:", result);

      // Track successful form submission
      posthog?.capture("rsdnts_application_submitted", {
        page: "rsdnts_application",
        walletAddress: data.walletAddress,
        hasNFT: true,
        timestamp: new Date().toISOString(),
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application. Please try again.");
    }
  };

  // const handleTwitterLogin = () => {
  //   // Open Twitter OAuth in a new window to avoid CORS issues
  // };

  // Success screen after form submission
  if (isSubmitted) {
    return (
      <div
        className="min-h-screen w-full text-black relative overflow-hidden flex items-center justify-center cursor-pointer"
        onClick={() => router.push("/")}
      >
        <div className="text-center max-w-2xl mx-auto px-8">
          <div className="mb-8">
            <Image
              src="/rsdnts.png"
              alt="rsdnts"
              width={280}
              height={280}
              className="mx-auto mb-8"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            you&apos;re on the waitlist
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            we&apos;ll be in touch. sit tight
          </p>
          <p className="text-sm text-gray-400">click anywhere to continue</p>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden">
        {/* Background Pattern */}

        <div className="relative z-0 md:max-w-4xl md:mx-auto md:px-8 py-20">
          {/* Header */}
          <div className="flex flex-col items-center">
            <div className="text-center mb-4 my-10 flex flex-grow">
              <div className="relative  flex flex-grow">
                <Image
                  src="/rsdnts.png"
                  alt="rsdnts"
                  width={280}
                  height={280}
                  className="md:mx-auto"
                />
              </div>
            </div>

            {/* CTA */}
            <div className="text-center ">
              <div className=" mb-8 pt-0 flex flex-col items-center gap-4">
                <Button
                  onClick={() => {
                    posthog?.capture("rsdnts_twitter_login_clicked", {
                      page: "rsdnts_application",
                      timestamp: new Date().toISOString(),
                    });
                    signIn("twitter");
                  }}
                  className=" bg-black text-white   rounded-lg"
                >
                  <RiTwitterXLine
                    className=" text-white fill-white"
                    fill="white"
                  />
                  Login
                </Button>
                <p className="text-xl font-bold ">
                  unlock exclusive access and opportunities
                </p>
              </div>
            </div>
          </div>

          {/* Main Description */}
          <div className="p-2">
            <div className="mb-8">
              <p className="text-md leading-relaxed space-y-3">
                <span className="block italic">ctzns + rsdnts = ctown</span>
                <span className="block">
                  [rsdnts] are high agency founders, operators, content
                  creators, investors. <br /> the ones defining culture and
                  building the town block by block.
                </span>
                <span className="block">
                  if you&apos;ve been here, listening, learning, watching the
                  town grow, you&apos;re not just audience. <br /> you&apos;re
                  building it too.
                </span>
                <span className="block">
                  [rsdnts] are the lifeline of cryptotown. <br /> and the
                  townhall is where stories, culture and opportunities get
                  passed on.
                </span>
              </p>
            </div>
          </div>

          {/* Who is eligible */}
          <div className="mb-8 p-2">
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
                founders
              </li>
              <li className="flex items-center text-md text-black">
                <span className="w-2 h-2 bg-black rounded-full mr-4"></span>
                investors
              </li>
              <li className="flex items-center text-md text-black">
                <span className="w-2 h-2 bg-black rounded-full mr-4"></span>
                operators
              </li>
              <li className="flex items-center text-md text-black">
                <span className="w-2 h-2 bg-black rounded-full mr-4"></span>
                content creators
              </li>

              {/* <li className="flex items-center text-md text-black">
                <span className="w-2 h-2 bg-black rounded-full mr-4"></span>
                <Link
                  href="https://pods.media/crypto-town"
                  target="_blank"
                  className="text-black transition-colors underline  "
                >
                  minted atleast 1 cryptotown episode
                </Link>
              </li> */}
            </ul>
          </div>

          {/* What to expect */}
          <div className=" mb-8 p-2">
            <h2 className="text-xl font-bold mb-3">what to expect</h2>
            <ul className="space-y-4">
              <li className="flex items-center text-md text-black">
                <span className="w-2 h-2 bg-black rounded-full mr-4"></span>
                exposure to dealflow
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
                exclusive access to cryptotown network and private events
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Logged in state - Application form
  return (
    <div className="min-h-screen w-full text-black relative overflow-hidden">
      <div className="relative z-0 md:max-w-4xl md:mx-auto md:px-8 py-16">
        {/* Header */}
        <div className="text-center mt-16">
          <div className="relative inline-block mb-8">
            <Image
              src="/rsdnts.png"
              alt="rsdnts"
              width={280}
              height={280}
              className="mx-auto"
            />
          </div>
          <h1 className="text-xl md:text-6xl font-black tracking-tight mb-4">
            become a [rsdnt]
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            unlock exclusive access and opportunities
          </p>
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
                      value: 10,
                      message: "Please provide at least 10 characters",
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
                  htmlFor="walletAddress"
                  className="block text-lg font-semibold mb-3"
                >
                  5. Wallet address (mint atleast 1 cryptotown episode to be
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
                    href="https://pods.media/crypto-town"
                    className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-blue-400/30 hover:decoration-blue-300"
                    target="_blank"
                  >
                    Free Mint
                  </Link>
                  <span className="ml-1"> to be eligible</span>
                </p>
              </div>

              <div className="pt-8">
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    nftStatus === "checking" ||
                    nftStatus === "noNFT" ||
                    nftStatus === "error" ||
                    Object.keys(errors).length > 0
                  }
                  className="w-full bg-[#E3D8D1] text-black px-8 py-6 text-xl font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-[#E3D8D1]/80 shadow-2xl shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : nftStatus === "checking" ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                      Checking NFTs...
                    </span>
                  ) : nftStatus === "noNFT" ? (
                    "Mint at least 1 NFT"
                  ) : nftStatus === "error" ? (
                    "Error checking NFT"
                  ) : (
                    "Submit Application"
                  )}
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
