'use client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { createPlaylist, searchManySongs } from './utils/spotify';
import Search from './components/Search';
import SearchResult from './components/SearchResult';
import { Cookies } from './constant/cookies';
import { getCookieValue } from './utils/cookie';

const PageContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 100%;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: #4caf50;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 480px) {
    gap: 15px;
    flex-direction: column;
  }
`;

const Button = styled.button`
  background-color: ${(props) => (props.disabled ? '#ccc' : '#4caf50')};
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.disabled ? '#ccc' : '#45a049')};
  }

  @media (max-width: 768px) {
    padding: 10px 15px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    width: 100%; /* Ensure buttons are full width on small screens */
  }
`;

export default function Home() {
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [playlistName, setPlaylistName] = useState('');
  const [loadingCreatePlaylist, setLoadingCreatePlaylist] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const expiresAt = getCookieValue(Cookies.SPOTIFY_EXPIRES_AT);
    if (expiresAt) setAuthorized(true);
  }, []);

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
      alert('Playlist created, enjoy!');
    } catch (error) {
      console.error('Error creating playlist:', error);
    } finally {
      setLoadingCreatePlaylist(false);
    }
  };

  return (
    <PageContainer>
      <Title>Spotify Playlist Generator</Title>
      <Search
        setSearchResult={setSearchResult}
        playlistName={playlistName}
        setPlaylistName={setPlaylistName}
      />
      <SearchResult searchResult={searchResult} />

      <ButtonContainer>
        {searchResult.length > 0 && (
          <Button
            onClick={handleCreatePlaylist}
            disabled={loadingCreatePlaylist}
          >
            {loadingCreatePlaylist ? 'Creating Playlist...' : 'Create Playlist'}
          </Button>
        )}

        {!authorized && (
          <Button onClick={handleAuthorize}>Authorize Spotify</Button>
        )}

        <Button
          onClick={() =>
            window.open(process.env.NEXT_PUBLIC_CAFECITO_APP_REDIRECT_LINK)
          }
        >
          Buy me a coffee!
        </Button>
      </ButtonContainer>
    </PageContainer>
  );
}
