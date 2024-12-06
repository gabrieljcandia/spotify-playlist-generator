export async function getSpotifyAccessToken(): Promise<string> {
  const response = await fetch('/api/spotify/token', { method: 'POST' });
  const data = await response.json();

  if (!data.access_token) {
    throw new Error('Failed to retrieve access token');
  }

  return data.access_token;
}
export async function searchSongs(track: string, artist: string): Promise<any> {
  const accessToken = await getSpotifyAccessToken();
  const response = await fetch(
    `/api/spotify/search?track=${encodeURIComponent(track)}&artist=${encodeURIComponent(artist)}&access_token=${accessToken}`
  );
  const data = await response.json();

  if (!data.tracks) {
    throw new Error('Failed to retrieve tracks');
  }

  return data.tracks.items;
}
