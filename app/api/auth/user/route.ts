import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userSessionCookie = request.cookies.get("twitter_user_session");

    if (!userSessionCookie?.value) {
      return NextResponse.json({ isLoggedIn: false });
    }

    const userSession = JSON.parse(userSessionCookie.value);

    return NextResponse.json({
      isLoggedIn: true,
      user: userSession,
    });
  } catch (error) {
    console.error("Error getting user session:", error);
    return NextResponse.json({ isLoggedIn: false });
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true });
    response.cookies.delete("twitter_user_session");
    return response;
  } catch (error) {
    console.error("Error logging out:", error);
    return NextResponse.json({ success: false });
  }
}
