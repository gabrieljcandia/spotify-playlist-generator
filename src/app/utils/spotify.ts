import { Cookies } from "../constant/cookies";
import { getCookieValue } from "./cookie";

const OPEN_URL = 'https://open.spotify.com/playlist';

export async function getSpotifyAccessToken(): Promise<string> {
  const response = await fetch('/api/spotify/token', { method: 'POST' });
  const data = await response.json();

  if (!data.access_token) {
    throw new Error('Failed to retrieve access token');
  }

  return data.access_token;
}

export async function searchSong(track: string, artist: string): Promise<any> {
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

export async function searchManySongs(searchResult: any[]) {
  const spotifyAccessToken = await getSpotifyAccessToken();

  const results = await Promise.all(
    searchResult.map(async (song) => {
      const res = await fetch(
        `/api/spotify/search?track=${encodeURIComponent(song.song)}&artist=${encodeURIComponent(song.artist)}&access_token=${spotifyAccessToken}`,
      );
      const data = await res.json();
      const trackId = data.tracks?.items[0]?.id || null;
      return { ...song, spotifyId: trackId };
    }),
  );

  return results.filter((song) => song.spotifyId);
}

export async function createPlaylist(playlistName: string, spotifyResults: any[]) {
  try {
    await refreshTokenIfNeeded();

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

    return playlistData;
  } catch (error) {
    console.error('Error during playlist creation or track addition:', error);
    throw error;
  }
};

export function buildSpotifyPlaylistLink(playlistId: string) {
  return `${OPEN_URL}/${playlistId}`;
}

export async function refreshTokenIfNeeded() {
  const expiresAt = getCookieValue(Cookies.SPOTIFY_EXPIRES_AT);
  const expired = expiresAt ? new Date(parseInt(expiresAt)) < new Date() : true;
  if (expired) {
    await fetch('/api/spotify/auth/refresh', { method: 'POST' });
  }
}
