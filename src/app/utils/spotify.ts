import { Cookies } from "../constant/cookies";
import { getCookieValue } from "./cookie";
import { logError } from "./logger";

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

async function fetchJsonWithErrorHandling(url: string, options: RequestInit, action: string, extraData: any = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorBody = await response.json();
    const error = new Error(`Failed to ${action}: ${response.statusText}`);
    (error as any).cause = errorBody;
    logError(error, {
      extra: { ...extraData, responseBody: errorBody },
      contexts: { actionContext: { action } },
    });
    throw error;
  }

  return response.json();
}

export async function createPlaylist(playlistName: string, spotifyResults: any[]) {
  try {
    await refreshTokenIfNeeded();

    // Step 1: Fetch User Profile
    const profileData = await fetchJsonWithErrorHandling(
      '/api/spotify/user',
      { headers: { 'Content-Type': 'application/json' } },
      'fetch user profile',
      { playlistName }
    );
    const userId = profileData.id;

    if (!userId) {
      throw new Error('User ID not found in profile data');
    }

    // Step 2: Create Playlist
    const playlistData = await fetchJsonWithErrorHandling(
      '/api/spotify/create-playlist',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, playlistName, description: 'Generated Playlist', isPublic: true }),
      },
      'create playlist',
      { userId, playlistName }
    );
    const playlistId = playlistData.id;

    if (!playlistId) {
      throw new Error('Playlist ID not found in response data');
    }

    // Step 3: Add Tracks to Playlist
    const trackUris = spotifyResults.map((song) => `spotify:track:${song.spotifyId}`);
    await fetchJsonWithErrorHandling(
      '/api/spotify/add-tracks',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playlistId, trackUris }),
      },
      'add tracks to playlist',
      { playlistId, trackUris }
    );

    return { id: playlistId };
  } catch (error) {
    logError(error, {
      extra: { playlistName, spotifyResults, responseBody: (error as any).cause || null },
      contexts: { generalError: { step: 'overall process' } },
    });
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
