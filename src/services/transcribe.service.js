import vosk from "vosk";
import fs from "fs";
import { Readable } from "stream";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

ffmpeg.setFfmpegPath(ffmpegInstaller.path); // 👈 Auto-FFmpeg for all OS

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

vosk.setLogLevel(0);

// Path to model
const MODEL_PATH = path.join(__dirname, "../models/vosk-model-small-en-us-0.15");

let model;

try {
    model = new vosk.Model(MODEL_PATH);
    console.log("Vosk model loaded!");
} catch (e) {
    console.error("Error loading model:", e);
}

// Convert any audio (mp3/webm/ogg/wav) → 16kHz mono WAV
const convertToWav = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .audioFrequency(16000)
            .audioChannels(1)
            .toFormat("wav")
            .on("end", () => resolve(outputPath))
            .on("error", reject)
            .save(outputPath);
    });
};

export const transcribeAudio = async (filePath) => {
    const wavPath = filePath + ".wav";

    // Step 1: Convert to proper WAV
    await convertToWav(filePath, wavPath);

    // Step 2: Create audio stream
    const fileStream = fs.createReadStream(wavPath);

    // Step 3: Create recognizer
    const rec = new vosk.Recognizer({ model, sampleRate: 16000 });

    return new Promise((resolve, reject) => {
        fileStream.on("data", (chunk) => {
            rec.acceptWaveform(chunk);
        });

        fileStream.on("end", () => {
         const result = rec.finalResult(); // already an object
         rec.free();
         resolve(result.text); // ⬅ FIX: no JSON.parse
});

        fileStream.on("error", reject);
    });
};
