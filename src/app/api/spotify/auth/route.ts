import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI, SPOTIFY_AUTH_SCOPE } = process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_REDIRECT_URI || !SPOTIFY_AUTH_SCOPE) {
    return NextResponse.json({ error: "Missing Spotify credentials" }, { status: 500 });
  }

  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${encodeURIComponent(
    SPOTIFY_CLIENT_ID
  )}&scope=${encodeURIComponent(SPOTIFY_AUTH_SCOPE)}&redirect_uri=${encodeURIComponent(
    SPOTIFY_REDIRECT_URI
  )}`;

  return NextResponse.json({ authUrl });
}
