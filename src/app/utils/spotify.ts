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

export async function createPlaylist(playlistName: string, spotifyResults: any[]) {
  try {
    const profileResponse = await fetch('/api/spotify/user', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const profileData = await profileResponse.json();
    const userId = profileData.id;

    const description = 'Generated Playlist';
    const isPublic = true;

    // Step 1: Create Playlist
    const playlistResponse = await fetch('/api/spotify/create-playlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, playlistName, description, isPublic }),
    });

    const playlistData = await playlistResponse.json();
    const playlistId = playlistData.id;

    if (!playlistId) {
      console.error('Failed to create playlist');
      return;
    }

    // Step 2: Add Tracks to Playlist
    const trackUris = spotifyResults.map(
      (song) => `spotify:track:${song.spotifyId}`,
    );

    await fetch('/api/spotify/add-tracks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playlistId, trackUris }),
    });
  } catch (error) {
    console.error('Error during playlist creation or track addition:', error);
  }
};