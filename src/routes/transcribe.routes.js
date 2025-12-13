import express from "express";
import multer from "multer";
import { handleTranscription } from "../controllers/transcribe.controller.js";

const router = express.Router();
const upload = multer({ dest: "tmp_uploads/" });

router.post("/", upload.single("audio"), handleTranscription);

export default router;
