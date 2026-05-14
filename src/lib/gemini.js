import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY 
});

export const getGeminiModel = (modelName = "gemini-3-flash-preview") => {
  return ai.models;
};

export async function generateContent(prompt, modelName = "gemini-3-flash-preview") {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export default ai;
