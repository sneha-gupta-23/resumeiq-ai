import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const models = [
  'gemini-3.5-flash',
  'gemini-3.1-pro',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest'
];

for (const model of models) {
  try {
    console.log(`Testing: ${model}...`);
    const response = await ai.models.generateContent({
      model,
      contents: 'Reply with just the word OK',
    });
    console.log(`  ✅ ${model} works! Response: "${response.text?.trim()}"`);
  } catch (err) {
    console.log(`  ❌ ${model} failed: ${err.message?.slice(0, 100)}`);
  }
}
