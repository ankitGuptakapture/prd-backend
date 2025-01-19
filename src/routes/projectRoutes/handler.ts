import { Request, Response } from "express";
import db from "@/drizzle";
import { and, eq } from "drizzle-orm";
import Project from "@/models/Project";
import Chats from "@/models/Chats";

export const getChatsByProjectId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.decoded;
        const getChatsWithProject = await db.query.Project.findFirst({
            where: and(
                eq(Project.id, parseInt(id)),
                eq(Project.userId, userId)
            ),
            with: {
                chats: {
                    orderBy: () => [Chats.createdAt]
                }
            }
        });
        return res.status(200).json({ data: getChatsWithProject, message: "Success" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const getProjects = async (req: Request, res: Response) => {
    try {
        const { id } = req.decoded;
        const projects = await db.query.Project.findMany({
            where: eq(Project.userId, id),
            orderBy: (project) => [project.createdAt]
        });
        return res.status(200).json({ data: projects, message: "success" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}