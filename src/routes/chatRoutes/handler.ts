import { and, eq } from "drizzle-orm";
import MessageThread from "@/models/MessageThread";
import db from "@/drizzle";
import { Request, Response } from "express";
import Chats from "@/models/Chats";
export const getThreads = async (req: Request, res: Response) => {
  try {
    const { id } = req.decoded;
    const threads = await db.query.MessageThread.findMany({
      where: eq(MessageThread.userId, id),
    });
    return res.status(200).json({ data: threads, message: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createThread = async (req: Request, res: Response) => {
  try {
    const { id } = req.decoded;
    const { title } = req.body;
    const thread = await db
      .insert(MessageThread)
      .values({
        userId: id,
        title,
      })
      .returning();
    return res.status(200).json({ data: thread[0], message: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getThreadMessages = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.decoded;
    console.log(req.params, "paramsss",userId);
    const messages = await db.query.Chats.findMany({
      where: and(eq(Chats.threadId, parseInt(id)), eq(Chats.userId, userId)),
      orderBy: (chats) => [chats.createdAt],
    });
    return res.status(200).json({ data: messages, message: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.decoded;
    const { threadId, message } = req.body;
    const chat = await db
      .insert(Chats)
      .values({
        threadId,
        userMessage: message,
        userId: id,
      })
      .returning();
    return res.status(200).json({ data: chat[0], message: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
