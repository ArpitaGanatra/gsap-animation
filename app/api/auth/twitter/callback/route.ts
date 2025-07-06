import { NextRequest, NextResponse } from "next/server";

const TWITTER_CLIENT_ID = process.env.NEXT_TWITTER_CLIENT_ID;
const TWITTER_CLIENT_SECRET = process.env.NEXT_TWITTER_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_BASE_URL
  ? `${process.env.NEXT_PUBLIC_BASE_URL.replace(
      /\/$/,
      ""
    )}/api/auth/twitter/callback`
  : "http://localhost:3000/api/auth/twitter/callback";

const TWITTER_API_BASE = "https://api.twitter.com/2";

interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
  verified: boolean;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
  };
}

async function getTwitterUserData(accessToken: string): Promise<TwitterUser> {
  try {
    const response = await fetch(
      `${TWITTER_API_BASE}/users/me?user.fields=public_metrics,profile_image_url,verified`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch Twitter user data:", error);
    throw new Error("Failed to fetch Twitter user data");
  }
}

export async function GET(request: NextRequest) {
  try {
    // Validate environment variables
    if (!TWITTER_CLIENT_ID) {
      console.error("Missing TWITTER_CLIENT_ID in callback");
      return NextResponse.redirect("/rsdnts?error=missing_client_id");
    }

    if (!TWITTER_CLIENT_SECRET) {
      console.error("Missing TWITTER_CLIENT_SECRET in callback");
      return NextResponse.redirect("/rsdnts?error=missing_client_secret");
    }

    console.log("Callback Configuration:", {
      clientId: TWITTER_CLIENT_ID,
      redirectUri: REDIRECT_URI,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    });

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    console.log("Callback Parameters:", {
      code: !!code,
      state: !!state,
      error,
    });

    // Check for OAuth errors
    if (error) {
      console.error("Twitter OAuth error:", error);
      return NextResponse.redirect("/rsdnts?error=auth_denied");
    }

    // Verify state parameter
    const storedState = request.cookies.get("twitter_oauth_state")?.value;
    console.log("State verification:", {
      hasStoredState: !!storedState,
      hasState: !!state,
      stateMatch: state === storedState,
    });

    if (!storedState || state !== storedState) {
      console.error("State mismatch in Twitter OAuth");
      return NextResponse.redirect("/rsdnts?error=invalid_state");
    }

    if (!code) {
      console.error("No authorization code received");
      return NextResponse.redirect("/rsdnts?error=no_code");
    }

    // Get the stored code verifier
    const codeVerifier = request.cookies.get("twitter_code_verifier")?.value;
    console.log("Code verifier check:", { hasCodeVerifier: !!codeVerifier });

    if (!codeVerifier) {
      console.error("No code verifier found");
      return NextResponse.redirect("/rsdnts?error=no_code_verifier");
    }

    console.log("Starting token exchange...");

    // Exchange authorization code for access token
    const tokenResponse = await fetch(`${TWITTER_API_BASE}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        code: code,
        grant_type: "authorization_code",
        client_id: TWITTER_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    console.log("Token response status:", tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorText,
      });
      return NextResponse.redirect("/rsdnts?error=token_exchange_failed");
    }

    const tokenData = await tokenResponse.json();
    console.log("Token exchange successful, fetching user data...");

    const { access_token } = tokenData;
    const twitterUser = await getTwitterUserData(access_token);

    // Create a session with user data
    const userSession = {
      id: twitterUser.id,
      username: twitterUser.username,
      name: twitterUser.name,
      profile_image_url: twitterUser.profile_image_url,
      verified: twitterUser.verified || false,
      followers_count: twitterUser.public_metrics?.followers_count || 0,
      following_count: twitterUser.public_metrics?.following_count || 0,
      tweet_count: twitterUser.public_metrics?.tweet_count || 0,
    };

    const response = NextResponse.redirect("/rsdnts?login=success");

    // Set user session cookie
    response.cookies.set("twitter_user_session", JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Clear the OAuth state and code verifier cookies
    response.cookies.delete("twitter_oauth_state");
    response.cookies.delete("twitter_code_verifier");

    return response;
  } catch (error) {
    console.error("Twitter OAuth callback error:", error);

    const response = NextResponse.redirect("/rsdnts?error=callback_failed");

    // Clear cookies on error
    response.cookies.delete("twitter_oauth_state");
    response.cookies.delete("twitter_code_verifier");

    return response;
  }
}
