"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

interface ApplicationForm {
  name: string;
  telegram: string;
  twitter: string;
  proofOfWork: string;
  whyJoin: string;
  walletAddress: string;
}

export default function Rsdnts() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    // Implement Twitter login logic here
    setIsLoggedIn(true);
  };

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
