import { GoogleGenAI, Type } from "@google/genai";
import { GeoLocation, ChatMessage } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION_SEARCH = `
You are a geospatial data expert assistant for a electoral map application. 
Your job is to translate user queries into specific geographic coordinates in Queretaro State of Mexico.
Always prefer locations in Mexico unless specified otherwise.
`;

const SYSTEM_INSTRUCTION_CHAT = `
You are a GIS (Geographic Information System) assistant. 
You help users understand geography, demographics, and terrain.
If you use Google Maps grounding, ensure you provide helpful summaries.
`;

const MODEL_ID = "gemini-2.5-flash";

export const searchLocations = async (query: string, center?: {lat: number, lng: number}): Promise<GeoLocation[]> => {
  try {
    const prompt = `
      User Query: "${query}"
      Current Map Center: ${center ? `${center.lat}, ${center.lng}` : 'Central Mexico'}
      
      Task: Identify up to 10 relevant geographic locations based on the query.
      If the query is generic (e.g., "schools"), find prominent ones near the map center.
      If the query is specific, find that exact location.
      
      Return a JSON array of objects with these properties:
      - name (string)
      - lat (number)
      - lng (number)
      - description (short string)
      - category (string: e.g., 'Education', 'Health', 'Government', 'Commercial', 'Other')
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_SEARCH,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER },
              description: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["name", "lat", "lng"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as GeoLocation[];
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return [];
  }
};

export const askAssistant = async (query: string, contextLat?: number, contextLng?: number): Promise<ChatMessage> => {
  try {
    const modelId = "gemini-2.5-flash";
    
    // Using Google Maps Grounding for real-world info
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: query,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_CHAT,
        tools: [{ googleMaps: {} }],
        toolConfig: contextLat && contextLng ? {
          retrievalConfig: {
            latLng: {
              latitude: contextLat,
              longitude: contextLng
            }
          }
        } : undefined
      }
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks?.map(chunk => {
      if (chunk.web) {
        return { uri: chunk.web.uri, title: chunk.web.title || 'Web Source' };
      }
      if (chunk.maps) {
        return { uri: chunk.maps.uri, title: chunk.maps.title || 'Map Location' };
      }
      return null;
    }).filter(Boolean) as { uri: string, title: string }[] || [];

    return {
      id: Date.now().toString(),
      role: 'model',
      text: response.text || "I couldn't find information on that.",
      groundingSources: sources
    };

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return {
      id: Date.now().toString(),
      role: 'model',
      text: "Sorry, I encountered an error processing your request."
    };
  }
};