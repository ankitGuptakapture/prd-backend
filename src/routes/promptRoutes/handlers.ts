import { Request, Response } from "express";
import chatGpt from "../../OpenAi";
import pdf from "pdf-parse";
import db from "@/drizzle";
import Chats from "@/models/Chats";
export const handleUserPropmts = async (req: Request, res: Response) => {
  try {
    const { prompt, threadId }: { prompt: string; threadId?: number } =
      req.body;
    const { id } = req.decoded;

    const resp = await chatGpt.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });
    if (threadId) {
      await db.insert(Chats).values({
        threadId,
        userMessage: prompt,
        userId: id,
        gptResponse: resp.choices[0].message.content,
      });
    }
    return res.status(200).json({ data: resp, message: "Successs" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleFileUpload = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const fileBuffer = req.file.buffer;
    const { prompt } = req.body;
    const pdfData = await pdf(fileBuffer);
    const response = await chatGpt.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: pdfData.text },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
      max_tokens: 4096,
    });
    return res.status(200).json({
      data: response,
      message: "PDF text extracted successfully",
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return res.status(500).json({ message: "Error processing PDF file" });
  }
};
