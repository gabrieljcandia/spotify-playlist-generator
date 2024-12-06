import { NextResponse } from 'next/server';

export async function POST(): Promise<NextResponse> {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    return NextResponse.json({ error: 'Missing Spotify credentials' }, { status: 500 });
  }

  const authBuffer = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authBuffer}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch token' }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
