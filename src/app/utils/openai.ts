import { OpenAI } from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Add this key to your .env.local file
});

/**
 * Function to generate a prompt and get a response from ChatGPT.
 * @param userInput The dynamic string to append to the hardcoded prompt.
 * @returns ChatGPT response text.
 */
export async function generatePrompt(userInput: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // You can switch to "gpt-4" if available
      messages: [
        { role: "user", content: userInput },
      ],
      max_tokens: 1000, // Adjust as needed
    });

    console.debug(`choices: ${JSON.stringify(response?.choices[0]?.message.content)}`);

    return response.choices[0]?.message?.content || "No response received.";
  } catch (error: any) {
    console.error("Error generating prompt:", error);
    throw new Error(error.message || "Failed to generate a response from ChatGPT.");
  }
}
