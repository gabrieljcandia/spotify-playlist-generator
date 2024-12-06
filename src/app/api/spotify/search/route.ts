import { NextResponse } from 'next/server';

export async function GET(req: Request): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const track = searchParams.get('track');
  const artist = searchParams.get('artist');
  const access_token = searchParams.get('access_token');

  if (!track || !artist || !access_token) {
    return NextResponse.json({ error: 'Missing track, artist, or access token' }, { status: 400 });
  }

  const query = `track:${encodeURIComponent(track)} artist:${encodeURIComponent(artist)}`;
  const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
