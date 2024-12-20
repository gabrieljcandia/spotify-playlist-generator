'use client';

import { useState } from 'react';
import styled from 'styled-components';

export interface SearchProps {
  setSearchResult: React.Dispatch<React.SetStateAction<any[]>>;
  playlistName: string;
  setPlaylistName: React.Dispatch<React.SetStateAction<string>>;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #4caf50;
    outline: none;
  }
`;

const Button = styled.button`
  background-color: ${(props) => (props.disabled ? '#ccc' : '#4caf50')};
  color: white;
  padding: 14px 20px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.disabled ? '#ccc' : '#45a049')};
  }
`;

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
    <Container>
      <FormGroup>
        <Label>Playlist Name (Required):</Label>
        <Input
          type="text"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="Enter Playlist Name"
          required
        />
      </FormGroup>
      <FormGroup>
        <Label>Mood:</Label>
        <Input
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
      </FormGroup>
      <FormGroup>
        <Label>Scenario:</Label>
        <Input
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
      </FormGroup>
      <FormGroup>
        <Label>Tempo:</Label>
        <Input
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
      </FormGroup>
      <FormGroup>
        <Label>Energy Level:</Label>
        <Input
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
      </FormGroup>
      <FormGroup>
        <Label>Lyric Content:</Label>
        <Input
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
      </FormGroup>

      <Button
        onClick={handleGenerateSongs}
        disabled={loading || playlistName.length === 0}
      >
        {loading ? 'Generating...' : 'Search Songs'}
      </Button>
    </Container>
  );
};

export default Search;
