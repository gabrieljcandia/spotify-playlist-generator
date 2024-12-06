"use client"
import { useState } from 'react';
import { searchSongs } from '../utils/spotify';

export default function SongSearch() {
  const [track, setTrack] = useState('');
  const [artist, setArtist] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      setError(null);
      const songs = await searchSongs(track, artist);
      setResults(songs);
    } catch (err) {
      console.error(err);
      setError('Failed to search songs');
    }
  };

  return (
    <div>
      <h1>Search for Songs</h1>
      <div>
        <input
          type="text"
          value={track}
          onChange={(e) => setTrack(e.target.value)}
          placeholder="Enter a track name"
        />
        <input
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Enter an artist name"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results.length > 0 && (
        <ul>
          {results.map((track) => (
            <li key={track.id}>
              <strong>{track.name}</strong> by {track.artists.map((artist: any) => artist.name).join(', ')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
