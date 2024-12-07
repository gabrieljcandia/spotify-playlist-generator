'use client';
import { useState } from 'react';
import { createPlaylist, getSpotifyAccessToken } from './utils/spotify';
import Search from './components/Search';
import SearchResult from './components/SearchResult';

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
      await createPlaylist(playlistName, spotifyResults);
    } catch (error) {
      console.error('Error creating playlist:', error);
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

          <SearchResult searchResult={searchResult} />

          <button onClick={findSpotifyTracks} disabled={loadingSpotify}>
            {loadingSpotify ? 'Finding Spotify IDs...' : 'Find Spotify Songs'}
          </button>

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
