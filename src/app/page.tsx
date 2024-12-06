"use client";
import { useState } from "react";
import { getSpotifyAccessToken } from "./utils/spotify";

export default function Home() {
  const [mood, setMood] = useState("");
  const [scenario, setScenario] = useState("");
  const [tempo, setTempo] = useState("");
  const [energyLevel, setEnergyLevel] = useState("");
  const [lyricContent, setLyricContent] = useState("");
  const [response, setResponse] = useState<any[]>([]);
  const [spotifyResults, setSpotifyResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSpotify, setLoadingSpotify] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [currentStep, setCurrentStep] = useState<"search" | "spotify" | "final">("search");

  const handleGenerateSongs = async () => {
    setLoading(true);
    setResponse([]);
    setSpotifyResults([]);
    setCurrentStep("search");

    const prompt = `
      Generate a list of 30 songs based on the following parameters, so that I can search for them in Spotify:
      Mood: ${mood || "-"},
      Scenario: ${scenario || "-"},
      Tempo: ${tempo || "-"},
      Energy Level: ${energyLevel || "-"},
      Lyric Content: ${lyricContent || "-"}.
      The result must be a parsed JSON array of song name and artist, like so: [{"song": string, "artist": string}]
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
        const parsedResponse = JSON.parse(data.response);
        setResponse(parsedResponse);
        setCurrentStep("spotify");
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

  const findSpotifyTracks = async () => {
    setLoadingSpotify(true);
    setSpotifyResults([]);
    setCurrentStep("spotify");

    try {
      const accessToken = await getSpotifyAccessToken();
      const results = await Promise.all(
        response.map(async (song) => {
          const res = await fetch(
            `/api/spotify/search?track=${encodeURIComponent(song.song)}&artist=${encodeURIComponent(song.artist)}&access_token=${accessToken}`
          );
          const data = await res.json();
          const trackId = data.tracks?.items[0]?.id || null;
          return { ...song, spotifyId: trackId };
        })
      );

      setSpotifyResults(results.filter((song) => song.spotifyId));
      setCurrentStep("final");
    } catch (error) {
      console.error("Error fetching Spotify tracks:", error);
    } finally {
      setLoadingSpotify(false);
    }
  };

  const handleAuthorize = async () => {
    try {
      const res = await fetch("/api/spotify/auth");
      const { authUrl } = await res.json();
      window.location.href = authUrl;
    } catch (error) {
      console.error("Authorization Error:", error);
    }
  };

  const handleCreatePlaylist = async () => {
    try {
      const profileResponse = await fetch("/api/spotify/user", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const profileData = await profileResponse.json();
      const userId = profileData.id;

      const description = "Generated Playlist";
      const isPublic = true;

      // Step 1: Create Playlist
      const playlistResponse = await fetch("/api/spotify/create-playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, playlistName, description, isPublic }),
      });

      const playlistData = await playlistResponse.json();
      const playlistId = playlistData.id;

      if (!playlistId) {
        console.error("Failed to create playlist");
        return;
      }

      console.log("Playlist Created:", playlistData);

      // Step 2: Add Tracks to Playlist
      const trackUris = spotifyResults.map((song) => `spotify:track:${song.spotifyId}`);

      const addTracksResponse = await fetch("/api/spotify/add-tracks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playlistId, trackUris }),
      });

      const addTracksData = await addTracksResponse.json();
      console.log("Tracks Added:", addTracksData);
    } catch (error) {
      console.error("Error during playlist creation or track addition:", error);
    }
  };

  return (
    <>
      <div>
        <div style={styles.container}>
          <h1 style={styles.title}>Music Playlist Generator</h1>
          <div style={styles.inputContainer}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Playlist Name (Required):</label>
              <input
                type="text"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="Enter Playlist Name"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Mood:</label>
              <input
                list="mood-options"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="Select or type a mood"
                style={styles.input}
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
            <div style={styles.inputGroup}>
              <label style={styles.label}>Scenario:</label>
              <input
                list="scenario-options"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder="Select or type a scenario"
                style={styles.input}
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
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tempo:</label>
              <input
                list="tempo-options"
                value={tempo}
                onChange={(e) => setTempo(e.target.value)}
                placeholder="Select or type a tempo"
                style={styles.input}
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
            <div style={styles.inputGroup}>
              <label style={styles.label}>Energy Level:</label>
              <input
                list="energy-options"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(e.target.value)}
                placeholder="Select or type an energy level"
                style={styles.input}
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
            <div style={styles.inputGroup}>
              <label style={styles.label}>Lyric Content:</label>
              <input
                list="lyric-options"
                value={lyricContent}
                onChange={(e) => setLyricContent(e.target.value)}
                placeholder="Select or type lyric content"
                style={styles.input}
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
          </div>


          {

            <button onClick={handleGenerateSongs} disabled={loading} style={styles.button}>
              {loading ? "Generating..." : "Search Songs"}
            </button>
          }

          {response.length > 0 && (
            <>
              <div>
                <h2 style={styles.subtitle}>Generated Songs</h2>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.tableHeader}>Song</th>
                      <th style={styles.tableHeader}>Artist</th>
                    </tr>
                  </thead>
                  <tbody>
                    {response.map((song, index) => (
                      <tr key={index}>
                        <td style={styles.tableCell}>{song.song}</td>
                        <td style={styles.tableCell}>{song.artist}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={findSpotifyTracks} disabled={loadingSpotify} style={styles.button}>
                {loadingSpotify ? "Finding Spotify IDs..." : "Find Spotify Songs"}
              </button>
            </>
          )}

          {currentStep === "final" && (
            <>
              <button onClick={handleAuthorize} style={styles.button}>
                Authorize Spotify
              </button>
              <button onClick={handleCreatePlaylist} style={styles.button}>
                Create Playlist
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

type StyleObject = React.CSSProperties;

const styles: Record<string, StyleObject> = {
  container: {
    fontFamily: "'Arial', sans-serif",
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  },
  title: {
    textAlign: "center",
    color: "#4CAF50",
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  subtitle: {
    textAlign: "left",
    color: "#333",
    marginTop: "20px",
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  inputContainer: {
    display: "grid",
    gap: "15px",
    marginBottom: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#555",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    transition: "border-color 0.2s ease-in-out",
  },
  inputFocus: {
    borderColor: "#4CAF50",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "12px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    border: "none",
    fontWeight: "bold",
    fontSize: "16px",
    transition: "background-color 0.3s ease-in-out",
  },
  buttonHover: {
    backgroundColor: "#45A049",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    overflow: "hidden",
  },
  tableHeader: {
    border: "1px solid #ddd",
    padding: "10px",
    backgroundColor: "#f4f4f4",
    textAlign: "left",
    fontWeight: "bold",
  },
  tableCell: {
    border: "1px solid #ddd",
    padding: "10px",
    color: "#555",
  },
};
