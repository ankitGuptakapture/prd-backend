import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
import { Request,Response } from "express";
import OpenAI from "openai";

dotenv.config();
const chatGpt = new OpenAI({
    apiKey: process.env.API_KEY,
})
export default chatGpt
const API_PREFIX = "/api";
const PORT = process.env.PORT || 8080;
export const handleUserPropmts = async (req: Request, res: Response) => {
  try {
    const { prompt }: { prompt: string } = req.body;
    const resp = await chatGpt.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });
    return res.status(200).json({ data: resp, message: "Successs" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// app.use(API_PREFIX, promptRoutes);

app.post(`${API_PREFIX}/prompt-chat`, handleUserPropmts);
app.get(`${API_PREFIX}/health-check`, (req, res) => {
  try {
    return res.status(200).json({
      message: "Server is running",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
