import fs from "fs-extra";
import { transcribeAudio } from "../services/transcribe.service.js";

export async function handleTranscription(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const inputFile = req.file.path;

    // Direct transcription (service handles conversion + reading)
    const text = await transcribeAudio(inputFile);

    // Cleanup
    await fs.remove(inputFile);

    return res.json({ text });
  } catch (err) {
    console.error("Transcription error:", err);
    return res.status(500).json({ error: "Transcription failed" });
  }
}
