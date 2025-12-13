import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api", healthRoutes);
app.get("/", (req, res) => {
  res.send("SpeakHealth API is running...");
});

export default app;
