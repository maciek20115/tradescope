import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const analyzeChartImage = async (base64Image: string, mimeType: string = 'image/jpeg'): Promise<string> => {
  const model = 'gemini-2.5-flash';

  const imagePart = {
    inlineData: {
      mimeType,
      data: base64Image,
    },
  };

  const textPart = {
    text: `You are "Scope", an expert trading analyst.
Analyze the provided financial chart. Your response must be concise and structured in Markdown.

### Prediction
Based on the technical patterns, state the most probable short-term price direction. Use one of these three options: **Likely Rise**, **Likely Fall**, or **Likely Sideways**.

### Confidence
Rate your confidence in this prediction as a percentage (e.g., **85%**).

### Justification
Provide a brief, 2-3 sentence explanation for your prediction and confidence level, mentioning the most critical pattern or indicator you see.

IMPORTANT: Do not provide financial advice. Your analysis is based solely on the visual data in the chart.`
  };
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Gemini API request failed.");
  }
};