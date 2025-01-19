import { Request, Response } from "express";
import chatGpt from "../../OpenAi";
import type { ChatCompletionMessageParam } from "openai/resources";
import pdf from "pdf-parse";
import db from "@/drizzle";
import Chats from "@/models/Chats";
import Project from "@/models/Project";
import { or } from "drizzle-orm";
import path from "path";
import fs from "fs/promises";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dovcd2rmf', 
  api_key: '562886346185529', 
  api_secret: "XCuTqTEml2JINqlnbPXf0XJFi0A"
});

export const handleUserPropmts = async (req: Request, res: Response) => {
  try {
    const { prompt, threadId, projectId }: { prompt: string; threadId?: string; projectId?: string } =
      req.body;
    const { id } = req.decoded;


    let messages: Array<ChatCompletionMessageParam> = [
      { role: "user", content: prompt },
    ];

    if (threadId || projectId) {

      let prevPrompt = { ...messages[0] };
      prevPrompt.role = "assistant";
      const previousMessages = await db.query.Chats.findMany({
        where: (chats, { eq, and }) =>
          or(eq(chats.threadId, parseInt(threadId || "0")), eq(chats.projectId, parseInt(projectId || "0"))),
          orderBy: (chats, { asc }) => [asc(chats.createdAt)],
      });
      if (previousMessages.length === 0) {
        return res.status(400).json({ message: " please check the provided context id" });
      }
      let userMessages = previousMessages.flatMap((msg) => [
        { role: "user", content: msg.userMessage || "" },
      ]) as ChatCompletionMessageParam[];
      let gptResponses = previousMessages.flatMap((msg) => [
        { role: "system", content: msg.gptResponse || "" },
      ]) as ChatCompletionMessageParam[];
      messages = [...userMessages, ...gptResponses, prevPrompt];

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
    const { id } = req.decoded;
    const fileBuffer = req.file.buffer;
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'uploads',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(fileBuffer);
    });

    const { prompt, projectDeadline, title, description } = req.body;
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
            {
              type: "text",
              text: description
            }
          ],
        },
      ],
      temperature: 0.8
    });
    const createdProject = await db.insert(Project).values({
      name: title,
      description,
      userId: id,
      projectDeadline: projectDeadline,
      filePath: (uploadResponse as any).secure_url // Use the Cloudinary URL
    }).returning()
    await db.insert(Chats).values({
      projectId: createdProject[0].id,
      userId: id,
      userMessage: `
      ${prompt}
      ${description}
      `,
      gptResponse: response.choices[0].message.content
    })
    return res.status(200).json({
      data: response,
      project: createdProject[0],
      message: "PDF text extracted successfully",
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return res.status(500).json({ message: "Error processing PDF file", error });
  }
};


