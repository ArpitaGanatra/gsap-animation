import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookies = request.cookies;

  return NextResponse.json({
    message: "Debug information",
    timestamp: new Date().toISOString(),
    cookies: {
      hasOAuthState: !!cookies.get("twitter_oauth_state"),
      hasCodeVerifier: !!cookies.get("twitter_code_verifier"),
      oauthState:
        cookies.get("twitter_oauth_state")?.value?.substring(0, 10) + "...",
      codeVerifier:
        cookies.get("twitter_code_verifier")?.value?.substring(0, 10) + "...",
    },
    environment: {
      hasClientId: !!process.env.NEXT_TWITTER_CLIENT_ID,
      hasClientSecret: !!process.env.NEXT_TWITTER_CLIENT_SECRET,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      nodeEnv: process.env.NODE_ENV,
      redirectUri: process.env.NEXT_PUBLIC_BASE_URL
        ? `${process.env.NEXT_PUBLIC_BASE_URL.replace(
            /\/$/,
            ""
          )}/api/auth/twitter/callback`
        : "http://localhost:3000/api/auth/twitter/callback",
    },
    headers: {
      userAgent: request.headers.get("user-agent"),
      referer: request.headers.get("referer"),
    },
  });
}
