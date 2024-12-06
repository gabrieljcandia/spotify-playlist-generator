"use client"
import { useState } from 'react';
import { searchSongs } from './utils/spotify';

export default function SongSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      setError(null);
      const songs = await searchSongs(query);
      setResults(songs);
    } catch (err) {
      console.error(err);
      setError('Failed to search songs');
    }
  };

  return (
    <div>
      <h1>Search for Songs</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a song or artist"
      />
      <button onClick={handleSearch}>Search</button>
      
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
