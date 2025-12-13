import express from "express";
import multer from "multer";
import { fullHealthCheck } from "../controllers/health.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/health-check", upload.single("audio"), fullHealthCheck);

export default router;
