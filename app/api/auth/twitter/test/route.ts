import { NextResponse } from "next/server";

export async function GET() {
  const config = {
    clientId: process.env.NEXT_TWITTER_CLIENT_ID,
    clientSecret: process.env.NEXT_TWITTER_CLIENT_SECRET
      ? "***SET***"
      : "***MISSING***",
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    redirectUri: process.env.NEXT_PUBLIC_BASE_URL
      ? process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/twitter/callback"
      : "http://localhost:3000/api/auth/twitter/callback",
    nodeEnv: process.env.NODE_ENV,
  };

  return NextResponse.json({
    message: "Twitter OAuth Configuration Test",
    config,
    issues: [
      !config.clientId && "Missing NEXT_TWITTER_CLIENT_ID",
      !process.env.NEXT_TWITTER_CLIENT_SECRET &&
        "Missing NEXT_TWITTER_CLIENT_SECRET",
      !config.baseUrl &&
        "Missing NEXT_PUBLIC_BASE_URL (using default localhost:3000)",
    ].filter(Boolean),
  });
}
