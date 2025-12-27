
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getGroupThemes = async (groupCount: number): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${groupCount} creative and professional team names for a corporate event. Provide only a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Error:", error);
    return Array.from({ length: groupCount }, (_, i) => `Team ${i + 1}`);
  }
};

export const getWinnerAnnouncement = async (name: string, prize: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a short, exciting, one-sentence announcement for ${name} who just won a ${prize}!`,
    });
    return response.text.trim();
  } catch {
    return `Congratulations to ${name} for winning ${prize}!`;
  }
};
