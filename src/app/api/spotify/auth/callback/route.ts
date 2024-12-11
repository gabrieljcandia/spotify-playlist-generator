import { Cookies } from "@/app/constant/cookies";
import { NextResponse } from "next/server";

export async function GET(req: Request): Promise<NextResponse> {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } = process.env;
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code || !SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  const authBuffer = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authBuffer}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to fetch access token" }, { status: response.status });
  }

  const { access_token, refresh_token, expires_in } = await response.json();

  // Store tokens as secure cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "Strict",
  };

  const expirationDate = new Date(Date.now() + expires_in * 1000).getTime();

  const headers = new Headers();
  headers.append("Set-Cookie", `${Cookies.SPOTIFY_ACCESS_TOKEN}=${access_token}; Max-Age=${expires_in}; ${Object.entries(cookieOptions).map(([k, v]) => `${k}=${v}`).join("; ")}`);
  headers.append("Set-Cookie", `${Cookies.SPOTIFY_REFRESH_TOKEN}=${refresh_token}; ${Object.entries(cookieOptions).map(([k, v]) => `${k}=${v}`).join("; ")}`);
  headers.append("Set-Cookie", `${Cookies.SPOTIFY_EXPIRES_AT}=${expirationDate}; Max-Age=${expires_in}; Path=/; Secure; SameSite=Strict`);

  headers.append("Location", "/");
  return new NextResponse(null, { status: 302, headers });
}
