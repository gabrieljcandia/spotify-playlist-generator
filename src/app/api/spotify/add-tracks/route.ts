import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Cookies } from "@/app/constant/cookies";

export async function POST(req: Request): Promise<NextResponse> {
  const cookieStore = await cookies();
  const access_token = cookieStore.get(Cookies.SPOTIFY_ACCESS_TOKEN)?.value;

  if (!access_token) {
    return NextResponse.json({ error: "Access token missing or expired" }, { status: 401 });
  }

  const { playlistId, trackUris } = await req.json();

  if (!playlistId || !trackUris || trackUris.length === 0) {
    return NextResponse.json({ error: "Missing required parameters or empty track list" }, { status: 400 });
  }

  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uris: trackUris, // Array of Spotify track URIs
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to add tracks to playlist" }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data); // Return the response from Spotify
}
