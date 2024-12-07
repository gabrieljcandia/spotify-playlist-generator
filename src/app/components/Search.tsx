'use client';

import { useState } from 'react';

export interface SearchProps {
  setSearchResult: React.Dispatch<React.SetStateAction<any[]>>;
  playlistName: string;
  setPlaylistName: React.Dispatch<React.SetStateAction<string>>;
}

const Search: React.FC<SearchProps> = ({
  setSearchResult,
  playlistName,
  setPlaylistName,
}) => {
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState('');
  const [scenario, setScenario] = useState('');
  const [tempo, setTempo] = useState('');
  const [energyLevel, setEnergyLevel] = useState('');
  const [lyricContent, setLyricContent] = useState('');

  const handleGenerateSongs = async () => {
    setLoading(true);
    setSearchResult([]);

    const prompt = `
        Generate a list of 30 songs based on the following parameters, so that I can search for them in Spotify:
        Mood: ${mood || '-'},
        Scenario: ${scenario || '-'},
        Tempo: ${tempo || '-'},
        Energy Level: ${energyLevel || '-'},
        Lyric Content: ${lyricContent || '-'}.
        The result must be a parsed JSON array of song name and artist, like so: [{"song": string, "artist": string}]
      `;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: prompt }),
      });

      const data = await res.json();
      if (data.response) {
        console.log('Response:', data.response);
        const parsedResponse = JSON.parse(data.response);
        setSearchResult(parsedResponse);
      } else {
        setSearchResult([]);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
      setSearchResult([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <label>Playlist Name (Required):</label>
        <input
          type="text"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="Enter Playlist Name"
          required
        />
      </div>
      <div>
        <label>Mood:</label>
        <input
          list="mood-options"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="Select or type a mood"
        />
        <datalist id="mood-options">
          <option value="Joyful" />
          <option value="Chill" />
          <option value="Melancholic" />
          <option value="Romantic" />
          <option value="Uplifting" />
          <option value="Mysterious" />
          <option value="Nostalgic" />
          <option value="Hopeful" />
          <option value="Dark" />
          <option value="Adventurous" />
        </datalist>
      </div>
      <div>
        <label>Scenario:</label>
        <input
          list="scenario-options"
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          placeholder="Select or type a scenario"
        />
        <datalist id="scenario-options">
          <option value="Road Trip" />
          <option value="Studying" />
          <option value="Workout" />
          <option value="Party" />
          <option value="Dinner Background" />
          <option value="Meditation" />
          <option value="Relaxing at Home" />
          <option value="Night Walk" />
          <option value="Celebration" />
          <option value="Focus Session" />
        </datalist>
      </div>
      <div>
        <label>Tempo:</label>
        <input
          list="tempo-options"
          value={tempo}
          onChange={(e) => setTempo(e.target.value)}
          placeholder="Select or type a tempo"
        />
        <datalist id="tempo-options">
          <option value="Fast" />
          <option value="Slow" />
          <option value="Moderate" />
          <option value="Groovy" />
          <option value="Intense" />
          <option value="Flowing" />
          <option value="Hypnotic" />
        </datalist>
      </div>
      <div>
        <label>Energy Level:</label>
        <input
          list="energy-options"
          value={energyLevel}
          onChange={(e) => setEnergyLevel(e.target.value)}
          placeholder="Select or type an energy level"
        />
        <datalist id="energy-options">
          <option value="High Energy" />
          <option value="Medium Energy" />
          <option value="Low Energy" />
          <option value="Relaxing" />
          <option value="Explosive" />
          <option value="Soothing" />
        </datalist>
      </div>
      <div>
        <label>Lyric Content:</label>
        <input
          list="lyric-options"
          value={lyricContent}
          onChange={(e) => setLyricContent(e.target.value)}
          placeholder="Select or type lyric content"
        />
        <datalist id="lyric-options">
          <option value="Non-Romantic" />
          <option value="Motivational" />
          <option value="Happy" />
          <option value="Melancholy" />
          <option value="Any" />
          <option value="Empowering" />
        </datalist>
      </div>

      {
        <button onClick={handleGenerateSongs} disabled={loading}>
          {loading ? 'Generating...' : 'Search Songs'}
        </button>
      }
    </div>
  );
};

export default Search;
