import { GoogleGenerativeAI } from '@google/generative-ai';

export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const generationConfig = {
  stopSequences: ['red'],
  maxOutputTokens: 60,
  temperature: 0.9,
  topP: 0.1,
  topK: 16,
};

// The Gemini 1.5 models are versatile and work with most use cases
export const genAIModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig,
});
