import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SearchResultSource, BinLog } from "../types";

// Helper to get AI instance safely
const getAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Helper to convert file to Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data-URI prefix (e.g. "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Searches for a specific topic using Google Search Grounding
 * Model: gemini-3-flash-preview
 */
export const searchTopic = async (query: string, context: string): Promise<{ text: string; sources: SearchResultSource[] }> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `You are an expert master gardener specializing in ${context}. Provide accurate, scientific, yet accessible information. Always verify facts with Google Search.`
      }
    });

    const sources: SearchResultSource[] = [];
    
    // Extract grounding chunks if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    return {
      text: response.text || "No results found.",
      sources: sources
    };
  } catch (error) {
    console.error("Search Error:", error);
    throw error;
  }
};

/**
 * Legacy wrapper for backward compatibility if needed
 */
export const searchEncyclopedia = (query: string) => searchTopic(query, "composting and vermiculture");

/**
 * Fetches the latest news about composting
 * Model: gemini-3-flash-preview
 */
export const fetchCompostNews = async (): Promise<{ text: string; sources: SearchResultSource[] }> => {
  try {
    const ai = getAI();
    const prompt = "Find 5 recent and interesting news stories, scientific studies, or trends related to composting, vermiculture, or soil regeneration from the last 3 months. Summarize each one in a bulletin format with a bold headline.";
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a news aggregator for a gardening app. Provide exciting, positive, and informative summaries of recent developments in the world of compost."
      }
    });

    const sources: SearchResultSource[] = [];
    
    // Extract grounding chunks if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    return {
      text: response.text || "No news found at the moment.",
      sources: sources
    };
  } catch (error) {
    console.error("News Fetch Error:", error);
    throw error;
  }
};

/**
 * Analyzes an image (e.g., identifying pests or bin moisture)
 * Model: gemini-3-pro-preview
 */
export const analyzeImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          { text: prompt || "Analyze this image related to composting or vermiculture." }
        ]
      },
      config: {
        systemInstruction: "You are a visual diagnostics expert for compost bins. Identify insects (friend or foe), moisture levels (too wet/dry), and decomposition stages."
      }
    });
    return response.text || "Could not analyze the image.";
  } catch (error) {
    console.error("Image Analysis Error:", error);
    throw error;
  }
};

/**
 * Analyzes a video (e.g., a short clip of turning a pile)
 * Model: gemini-3-pro-preview
 */
export const analyzeVideo = async (base64Video: string, mimeType: string, prompt: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Video
            }
          },
          { text: prompt || "Review this video clip of a composting process." }
        ]
      },
      config: {
        systemInstruction: "You are a composting process auditor. Watch the video to critique technique, identify potential issues in the pile structure, or assess worm activity levels."
      }
    });
    return response.text || "Could not analyze the video.";
  } catch (error) {
    console.error("Video Analysis Error:", error);
    throw error;
  }
};

/**
 * Solves complex problems using Thinking Mode
 * Model: gemini-3-pro-preview
 * Config: thinkingBudget = 32768
 */
export const solveComplexProblem = async (query: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: query,
      config: {
        thinkingConfig: {
           thinkingBudget: 32768 // Max for gemini 3 pro
        },
        // IMPORTANT: Do not set maxOutputTokens when using thinkingBudget per guidelines, 
        // or ensure it accounts for budget. Safest to omit maxOutputTokens here.
      }
    });
    return response.text || "I couldn't derive a solution.";
  } catch (error) {
    console.error("Thinking Mode Error:", error);
    throw error;
  }
};

/**
 * Analyzes compost mix and provides optimization advice
 * Model: gemini-3-flash-preview
 */
export const getCompostAdvice = async (mixDescription: string, currentRatio: number): Promise<string> => {
  try {
    const ai = getAI();
    const prompt = `I am building a compost pile with these ingredients: ${mixDescription}. 
    My calculated C:N ratio is approximately ${currentRatio.toFixed(1)}:1.
    
    Please provide brief, actionable advice in Markdown:
    1. Is this ratio optimal (ideal is 25-30:1)?
    2. If not, what specific common material (and roughly how much) should I add to fix it?
    3. Are there any specific pitfalls with this specific mix (e.g. matting grass, pine needle acidity)?`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a pragmatic compost coach. Keep answers concise, encouraging, and focused on the user's specific mix."
      }
    });
    return response.text || "No advice generated.";
  } catch (error) {
    console.error("Compost Advice Error:", error);
    throw error;
  }
};

/**
 * Generates an encouraging or helpful reply to a user post
 * Model: gemini-3-flash-preview
 */
export const generateSocialReply = async (postContent: string): Promise<string> => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `User post: "${postContent}"`,
            config: {
                systemInstruction: `You are "CompostBot 3000", a friendly, enthusiastic, and slightly witty community moderator for a gardening app. 
                Reply to the user's post. 
                If they share a success, celebrate it warmly. 
                If they ask a question, provide a brief, helpful tip. 
                Keep it under 50 words. Add an emoji.`
            }
        });
        return response.text || "That sounds interesting!";
    } catch (error) {
        return "Thanks for sharing! 🌱";
    }
};

/**
 * Analyzes logs from a bin to provide health trends
 * Model: gemini-3-flash-preview
 */
export const analyzeBinHealth = async (binType: string, logs: BinLog[]): Promise<string> => {
    try {
        const ai = getAI();
        // Format logs for context
        const logHistory = logs.slice(0, 5).map(l => 
            `Date: ${l.date}, Temp: ${l.temperature || 'N/A'}, Moisture: ${l.moisture}, Smell: ${l.smell}, Notes: ${l.notes}`
        ).join('\n');

        const prompt = `I have a ${binType} bin. Here are my recent logs:\n${logHistory}\n\nBased on these trends, what is the status of my bin? Give me 3 specific bullet points on what to do next.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                systemInstruction: "You are a data-driven compost analyst. Look for patterns in temperature, moisture, and smell. Be prescriptive."
            }
        });
        return response.text || "Keep monitoring your bin.";
    } catch (error) {
        return "Unable to analyze logs at this time.";
    }
};

/**
 * Gets weather advice for composting
 * Model: gemini-3-flash-preview
 */
export const getWeatherAdvice = async (location: string): Promise<string> => {
    try {
        const ai = getAI();
        const prompt = `What is the current weather and 3-day forecast for ${location}?
        Based on this, give specific, 1-sentence advice for managing an outdoor compost bin and a worm bin in this weather.
        
        Return the result in this exact Markdown format:
        **Current**: [Temp °F/Condition]
        **Forecast**: [Brief Summary]
        **Compost**: [Advice]
        **Worms**: [Advice]`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: "You are a weather-aware gardening assistant. Be concise."
            }
        });
        return response.text || "Unable to fetch weather.";
    } catch (error) {
        console.error("Weather Error", error);
        throw error;
    }
}
