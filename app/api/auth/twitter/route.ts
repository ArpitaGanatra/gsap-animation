import { NextResponse } from "next/server";
import crypto from "crypto";

const TWITTER_CLIENT_ID = process.env.NEXT_TWITTER_CLIENT_ID;
const TWITTER_CLIENT_SECRET = process.env.NEXT_TWITTER_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_BASE_URL
  ? process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/twitter/callback"
  : "http://localhost:3000/api/auth/twitter/callback";

function generateCodeVerifier(): string {
  return base64URLEncode(crypto.randomBytes(32));
}

function generateCodeChallenge(verifier: string): string {
  const hash = crypto.createHash("sha256").update(verifier).digest();
  return base64URLEncode(hash);
}

function base64URLEncode(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export async function GET() {
  try {
    // Validate environment variables
    if (!TWITTER_CLIENT_ID) {
      console.error("Missing TWITTER_CLIENT_ID");
      return NextResponse.redirect("/rsdnts?error=missing_client_id");
    }

    if (!TWITTER_CLIENT_SECRET) {
      console.error("Missing TWITTER_CLIENT_SECRET");
      return NextResponse.redirect("/rsdnts?error=missing_client_secret");
    }

    console.log("OAuth Configuration:", {
      clientId: TWITTER_CLIENT_ID,
      redirectUri: REDIRECT_URI,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    });

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const state = base64URLEncode(crypto.randomBytes(32));

    const authUrl = new URL("https://twitter.com/i/oauth2/authorize");
    const params = new URLSearchParams({
      response_type: "code",
      client_id: TWITTER_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: "tweet.read users.read",
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    const finalUrl = `${authUrl.toString()}?${params.toString()}`;
    console.log("Generated OAuth URL:", finalUrl);

    const response = NextResponse.redirect(finalUrl);

    // Set required cookies
    response.cookies.set("twitter_code_verifier", codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    });

    response.cookies.set("twitter_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Twitter OAuth error:", error);
    return NextResponse.redirect("/rsdnts?error=auth_failed");
  }
}
