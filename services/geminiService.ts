
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Recommendation } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

const prompt = `You are an expert market analyst AI named TradeScope. Analyze the provided stock market or cryptocurrency chart image. Based on the patterns, indicators, and trends visible in the chart, provide a detailed analysis. Your response must be in JSON format. The analysis should include: 1. A brief "prediction" of the likely future price movement. 2. A clear "recommendation" to either "BUY", "SELL", or "HOLD". 3. A "confidence" score from 0 to 100 on your recommendation. 4. A detailed "rationale" explaining the technical analysis that led to your conclusion.`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    prediction: {
      type: Type.STRING,
      description: 'A brief prediction of future price movement.',
    },
    recommendation: {
      type: Type.STRING,
      enum: ['BUY', 'SELL', 'HOLD'],
      description: 'The trading recommendation.',
    },
    confidence: {
      type: Type.INTEGER,
      description: 'Confidence score from 0 to 100.',
    },
    rationale: {
      type: Type.STRING,
      description: 'Detailed rationale for the recommendation.',
    },
  },
  required: ['prediction', 'recommendation', 'confidence', 'rationale'],
};

export const analyzeChart = async (imageBase64: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    };

    const textPart = {
      text: prompt,
    };

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      }
    });
    
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    // Validate the received data structure
    if (
      !result.prediction ||
      !result.recommendation ||
      !Object.values(Recommendation).includes(result.recommendation as Recommendation) ||
      typeof result.confidence !== 'number' ||
      !result.rationale
    ) {
      throw new Error('Invalid analysis data structure received from API.');
    }

    return result as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing chart:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to analyze chart: ${error.message}`);
    }
    throw new Error('An unknown error occurred during chart analysis.');
  }
};
