'use client';
import { useState } from 'react';
import { createPlaylist, searchManySongs } from './utils/spotify';
import Search from './components/Search';
import SearchResult from './components/SearchResult';

export default function Home() {
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [playlistName, setPlaylistName] = useState('');
  const [loadingCreatePlaylist, setLoadingCreatePlaylist] = useState(false);

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
    setLoadingCreatePlaylist(true);
    try {
      const spotifyTracks = await searchManySongs(searchResult);
      await createPlaylist(playlistName, spotifyTracks);
    } catch (error) {
      console.error('Error creating playlist:', error);
    } finally {
      setLoadingCreatePlaylist(false);
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
          />

          <SearchResult searchResult={searchResult} />

          {searchResult.length > 0 && (
            <>
              <button
                onClick={handleCreatePlaylist}
                disabled={loadingCreatePlaylist}
              >
                {loadingCreatePlaylist
                  ? 'Creating Playlist...'
                  : 'Create Playlist'}
              </button>
            </>
          )}

          <button onClick={handleAuthorize}>Authorize Spotify</button>
        </div>
      </div>
    </>
  );
}
