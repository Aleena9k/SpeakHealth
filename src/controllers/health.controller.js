import { transcribeAudio } from "../services/transcribe.service.js";
import { aiSymptomAnalysis } from "../services/llm.service.js";
import { fetchMedicalResearch } from "../services/research.service.js";
import { insertHealthRecord } from "../services/notion.service.js";

import { generatePatientId } from "../utils/patientId.js";
import { generateDocx } from "../utils/docxGenerator.js";


export const fullHealthCheck = async (req, res) => {
  try {
    const audioFile = req.file;

    if (!audioFile) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required.",
      });
    }

    // 1️⃣ Transcribe
    const transcript = await transcribeAudio(audioFile.path);

    // 2️⃣ LLM analysis
    const analysis = await aiSymptomAnalysis(transcript);

    // 🔥 Normalize probable conditions (objects → strings)
    const probableConditions = Array.isArray(analysis.conditions)
      ? analysis.conditions.map(c => c.name)
      : [];

    // 3️⃣ Research
    const research = await fetchMedicalResearch(probableConditions);

    // 4️⃣ Patient ID
    const patientId = generatePatientId();

    // 5️⃣ Generate DOCX
    const docxPath = await generateDocx(patientId, transcript, {
      symptoms: Array.isArray(analysis.symptoms) ? analysis.symptoms : [],
      summary: analysis.summary || "N/A",
      probableConditions,
      research,
    });

    // 6️⃣ Insert into Notion 🧠
    await insertHealthRecord({
      patientId,
      primarySymptom: analysis.primarySymptom || null,
      symptoms: Array.isArray(analysis.symptoms) ? analysis.symptoms : [],
      probableConditions,
      summary: analysis.summary || "N/A",
      severity: "Medium", // can be dynamic later
      docxUrl: docxPath, // URL or served file path
    });

    // ✅ Final response (as requested)
    return res.json({
      status: "success",
      message: "Workflow executed",
    });

  } catch (error) {
    console.error("Full Health Check Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to process full health check.",
    });
  }
};
