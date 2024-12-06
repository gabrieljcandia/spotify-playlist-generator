"use client"
import { useState } from 'react';

export default function ChatGPTIntegration() {
    const [userInput, setUserInput] = useState('');
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
  
    const handleGeneratePrompt = async () => {
      setLoading(true);
      setResponse(null);
  
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ input: userInput }),
        });
  
        const data = await res.json();
        if (data.response) {
          setResponse(data.response);
        } else {
          setResponse('No response from ChatGPT.');
        }
      } catch (error) {
        console.error('Error:', error);
        setResponse('Failed to fetch response.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div>
        <h1>ChatGPT Integration</h1>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your input..."
        />
        <button onClick={handleGeneratePrompt} disabled={loading}>
          {loading ? 'Loading...' : 'Generate'}
        </button>
  
        {response && (
          <div>
            <h2>Response:</h2>
            <p>{response}</p>
          </div>
        )}
      </div>
    );
  }
  