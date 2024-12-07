'use client';
import { useState } from 'react';
import { getSpotifyAccessToken } from './utils/spotify';
import Search from './components/Search';

export default function Home() {
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [playlistName, setPlaylistName] = useState('');
  const [spotifyResults, setSpotifyResults] = useState<any[]>([]);
  const [loadingSpotify, setLoadingSpotify] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    'search' | 'spotify' | 'final'
  >('search');

  const findSpotifyTracks = async () => {
    setLoadingSpotify(true);
    setSpotifyResults([]);
    setCurrentStep('spotify');

    try {
      const accessToken = await getSpotifyAccessToken();
      const results = await Promise.all(
        searchResult.map(async (song) => {
          const res = await fetch(
            `/api/spotify/search?track=${encodeURIComponent(song.song)}&artist=${encodeURIComponent(song.artist)}&access_token=${accessToken}`,
          );
          const data = await res.json();
          const trackId = data.tracks?.items[0]?.id || null;
          return { ...song, spotifyId: trackId };
        }),
      );

      setSpotifyResults(results.filter((song) => song.spotifyId));
      setCurrentStep('final');
    } catch (error) {
      console.error('Error fetching Spotify tracks:', error);
    } finally {
      setLoadingSpotify(false);
    }
  };

  const handleAuthorize = async () => {
    try {
      const res = await fetch('/api/spotify/auth');
      const { authUrl } = await res.json();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Authorization Error:', error);
    }
  };

  const handleCreatePlaylist = async () => {
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

      console.log('Playlist Created:', playlistData);

      // Step 2: Add Tracks to Playlist
      const trackUris = spotifyResults.map(
        (song) => `spotify:track:${song.spotifyId}`,
      );

      const addTracksResponse = await fetch('/api/spotify/add-tracks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playlistId, trackUris }),
      });

      const addTracksData = await addTracksResponse.json();
      console.log('Tracks Added:', addTracksData);
    } catch (error) {
      console.error('Error during playlist creation or track addition:', error);
    }
  };

  return (
    <>
      <div>
        <div>
          <h1>Music Playlist Generator</h1>
          <Search
            setSearchResult={setSearchResult}
            playlistName={playlistName}
            setPlaylistName={setPlaylistName}
            setSpotifyResults={setSpotifyResults}
            setCurrentStep={setCurrentStep}
          />

          {searchResult.length > 0 && (
            <>
              <div>
                <h2>Generated Songs</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Song</th>
                      <th>Artist</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResult.map((song, index) => (
                      <tr key={index}>
                        <td>{song.song}</td>
                        <td>{song.artist}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={findSpotifyTracks} disabled={loadingSpotify}>
                {loadingSpotify
                  ? 'Finding Spotify IDs...'
                  : 'Find Spotify Songs'}
              </button>
            </>
          )}

          {currentStep === 'final' && (
            <>
              <button onClick={handleAuthorize}>Authorize Spotify</button>
              <button onClick={handleCreatePlaylist}>Create Playlist</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
