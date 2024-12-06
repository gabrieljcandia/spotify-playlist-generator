"use client";
import { useState } from "react";

export default function Home() {
  const [mood, setMood] = useState("");
  const [scenario, setScenario] = useState("");
  const [tempo, setTempo] = useState("");
  const [energyLevel, setEnergyLevel] = useState("");
  const [lyricContent, setLyricContent] = useState("");
  const [response, setResponse] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateSongs = async () => {
    setLoading(true);
    setResponse([]);

    const prompt = `
      Generate a list of 30 songs based on the following parameters:
      Mood: ${mood || "-"},
      Scenario: ${scenario || "-"},
      Tempo: ${tempo || "-"},
      Energy Level: ${energyLevel || "-"},
      Lyric Content: ${lyricContent || "-"}.
      The result must be a TypeScript JSON array of song name and artist, exactly like this: [{"song": "songName", "artist": "artistName"}]
    `;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: prompt }),
      });

      const data = await res.json();
      if (data.response) {
        console.log("Response:", data.response);
        const parsedResponse = JSON.parse(data.response); // Parse the response into an array of songs
        setResponse(parsedResponse);
      } else {
        setResponse([]);
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
      setResponse([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Music Playlist Generator</h1>

      <div>
        <label>
          Mood:
          <select value={mood} onChange={(e) => setMood(e.target.value)}>
            <option value="">-</option>
            <option value="Joyful">Joyful</option>
            <option value="Chill">Chill</option>
            <option value="Melancholic">Melancholic</option>
            <option value="Romantic">Romantic</option>
            <option value="Uplifting">Uplifting</option>
            <option value="Mysterious">Mysterious</option>
            <option value="Nostalgic">Nostalgic</option>
            <option value="Hopeful">Hopeful</option>
            <option value="Dark">Dark</option>
            <option value="Adventurous">Adventurous</option>
          </select>
        </label>
        <input
          type="text"
          placeholder="Custom mood"
          onBlur={(e) => setMood(e.target.value)}
        />
      </div>

      <div>
        <label>
          Scenario:
          <select value={scenario} onChange={(e) => setScenario(e.target.value)}>
            <option value="">-</option>
            <option value="Road Trip">Road Trip</option>
            <option value="Studying">Studying</option>
            <option value="Workout">Workout</option>
            <option value="Party">Party</option>
            <option value="Dinner Background">Dinner Background</option>
            <option value="Meditation">Meditation</option>
            <option value="Relaxing at Home">Relaxing at Home</option>
            <option value="Night Walk">Night Walk</option>
            <option value="Celebration">Celebration</option>
            <option value="Focus Session">Focus Session</option>
          </select>
        </label>
        <input
          type="text"
          placeholder="Custom scenario"
          onBlur={(e) => setScenario(e.target.value)}
        />
      </div>

      <div>
        <label>
          Tempo:
          <select value={tempo} onChange={(e) => setTempo(e.target.value)}>
            <option value="">-</option>
            <option value="Fast">Fast</option>
            <option value="Slow">Slow</option>
            <option value="Moderate">Moderate</option>
            <option value="Groovy">Groovy</option>
            <option value="Intense">Intense</option>
            <option value="Flowing">Flowing</option>
            <option value="Hypnotic">Hypnotic</option>
          </select>
        </label>
        <input
          type="text"
          placeholder="Custom tempo"
          onBlur={(e) => setTempo(e.target.value)}
        />
      </div>

      <div>
        <label>
          Energy Level:
          <select
            value={energyLevel}
            onChange={(e) => setEnergyLevel(e.target.value)}
          >
            <option value="">-</option>
            <option value="High Energy">High Energy</option>
            <option value="Medium Energy">Medium Energy</option>
            <option value="Low Energy">Low Energy</option>
            <option value="Relaxing">Relaxing</option>
            <option value="Explosive">Explosive</option>
            <option value="Soothing">Soothing</option>
          </select>
        </label>
        <input
          type="text"
          placeholder="Custom energy level"
          onBlur={(e) => setEnergyLevel(e.target.value)}
        />
      </div>

      <div>
        <label>
          Lyric Content:
          <select
            value={lyricContent}
            onChange={(e) => setLyricContent(e.target.value)}
          >
            <option value="">-</option>
            <option value="Non-Romantic">Non-Romantic</option>
            <option value="Motivational">Motivational</option>
            <option value="Happy">Happy</option>
            <option value="Melancholy">Melancholy</option>
            <option value="Any">Any</option>
            <option value="Empowering">Empowering</option>
          </select>
        </label>
        <input
          type="text"
          placeholder="Custom lyric content"
          onBlur={(e) => setLyricContent(e.target.value)}
        />
      </div>

      <button onClick={handleGenerateSongs} disabled={loading}>
        {loading ? "Generating..." : "Generate Songs"}
      </button>

      {response.length > 0 && (
        <div>
          <h2>Generated Songs</h2>
          <ul>
            {response.map((song, index) => (
              <li key={index}>
                <strong>{song.song}</strong> by {song.artist}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
