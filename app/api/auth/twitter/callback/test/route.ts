import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Twitter callback test endpoint is working",
    timestamp: new Date().toISOString(),
    environment: {
      hasClientId: !!process.env.NEXT_TWITTER_CLIENT_ID,
      hasClientSecret: !!process.env.NEXT_TWITTER_CLIENT_SECRET,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      nodeEnv: process.env.NODE_ENV,
    },
  });
}
