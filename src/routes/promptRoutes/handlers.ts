import { Request, Response } from "express";
import chatGpt from "../../OpenAi";
import type { ChatCompletionMessageParam } from "openai/resources";
import pdf from "pdf-parse";
import db from "@/drizzle";
import Chats from "@/models/Chats";
export const handleUserPropmts = async (req: Request, res: Response) => {
  try {
    const { prompt, threadId }: { prompt: string; threadId?: string } =
      req.body;
    const { id } = req.decoded;
    console.log(typeof threadId, "req.body");

    let messages: Array<ChatCompletionMessageParam> = [
      { role: "user", content: prompt },
    ];

    if (threadId) {
      let prevPrompt = { ...messages[0] };
      prevPrompt.role = "assistant";
      const previousMessages = await db.query.Chats.findMany({
        where: (chats, { eq, and }) =>
          and(eq(chats.threadId, parseInt(threadId))),
        orderBy: (chats, { asc }) => [asc(chats.createdAt)],
      });
      let userMessages = previousMessages.flatMap((msg) => [
        { role: "user", content: msg.userMessage || "" },
      ]) as ChatCompletionMessageParam[];
      let gptResponses = previousMessages.flatMap((msg) => [
        { role: "system", content: msg.gptResponse || "" },
      ]) as ChatCompletionMessageParam[];
      messages = [...userMessages, ...gptResponses, ...messages];
      console.log(messages, "messsages");
    }
    const resp = await chatGpt.chat.completions.create({
      model: "gpt-4o",
      messages,
    });
    if (threadId) {
      await db.insert(Chats).values({
        threadId: parseInt(threadId),
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
