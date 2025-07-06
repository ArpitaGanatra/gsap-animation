import { NextResponse } from "next/server";

export async function GET() {
  const envCheck = {
    NEXT_TWITTER_CLIENT_ID: {
      exists: !!process.env.NEXT_TWITTER_CLIENT_ID,
      value: process.env.NEXT_TWITTER_CLIENT_ID ? "***SET***" : "***MISSING***",
      length: process.env.NEXT_TWITTER_CLIENT_ID?.length || 0,
    },
    NEXT_TWITTER_CLIENT_SECRET: {
      exists: !!process.env.NEXT_TWITTER_CLIENT_SECRET,
      value: process.env.NEXT_TWITTER_CLIENT_SECRET
        ? "***SET***"
        : "***MISSING***",
      length: process.env.NEXT_TWITTER_CLIENT_SECRET?.length || 0,
    },
    NEXT_PUBLIC_BASE_URL: {
      exists: !!process.env.NEXT_PUBLIC_BASE_URL,
      value: process.env.NEXT_PUBLIC_BASE_URL || "***MISSING***",
    },
    NODE_ENV: process.env.NODE_ENV || "***MISSING***",
  };

  const issues = [
    !envCheck.NEXT_TWITTER_CLIENT_ID.exists && "Missing NEXT_TWITTER_CLIENT_ID",
    !envCheck.NEXT_TWITTER_CLIENT_SECRET.exists &&
      "Missing NEXT_TWITTER_CLIENT_SECRET",
    !envCheck.NEXT_PUBLIC_BASE_URL.exists && "Missing NEXT_PUBLIC_BASE_URL",
  ].filter(Boolean);

  return NextResponse.json({
    message: "Environment Variables Check",
    timestamp: new Date().toISOString(),
    environment: envCheck,
    issues,
    status: issues.length === 0 ? "OK" : "ERROR",
  });
}
