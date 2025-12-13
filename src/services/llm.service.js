import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

export const aiSymptomAnalysis = async (transcript) => {
  try {
    const prompt = `
You are a medical summarization assistant for doctors. 
Extract symptoms and create a structured summary. 
DO NOT give a diagnosis — only list possible conditions with reasoning.

### INPUT:
${transcript}

### OUTPUT (JSON only):
{
  "symptoms": ["symptom1", "symptom2"],
  "primarySymptom": "main symptom",
  "conditions": [
    {
      "name": "Possible condition",
      "why": "Reason this condition might be relevant",
      "severityFlag": "low | medium | high"
    }
  ],
  "summary": "A short 3–4 sentence clinical-style summary for a doctor."
}
`;

    const result = await model.generateContent(prompt);

    let text = result.response.text();

    // Remove ```json or ``` wrappers if present
    text = text.replace(/```json|```/g, "");

    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini Symptom Analysis Error:", err);
    return {
      symptoms: [],
      primarySymptom: null,
      conditions: [],
      summary: "Unable to generate summary.",
    };
  }
};
