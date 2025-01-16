import { and, ilike, or, ne, sql, eq } from "drizzle-orm"
import db from "../../drizzle"
import type { Request, Response } from "express"
import users from "../../models/User"
import Chats from "../../models/Chats"
import SocketRoom from "../../models/SocketRoom"
export const findUsers = async (req: Request, res: Response) => {
    try {
        const name = req.query.name as string
        const getUsers = await db.query.users.findMany({
            where: and(ne(users.id, req?.decoded?.id), or(ilike(users.name, `%${name}%`), ilike(users.email, `%${name}%`)))
        })
        return res.status(200).send({ success: true, data: getUsers })
    } catch (error) {
        console.error(error, "error getting users");
        return res.status(500).send({ error: error, message: "Something went wrong" })
    }
}

export const findConnectedUsers = async (req: Request, res: Response) => {
    try {
        const roomId = req.query.roomId as string
        console.log(roomId);

        if (roomId) {
            const getChats = await db.query.SocketRoom.findFirst({
                where: eq(SocketRoom.id, parseInt(roomId)),
                with: {
                    sender: true,
                    reciever: true,
                    chatRooms: {
                        with: {
                            sender: {
                                columns: {
                                    id: true,
                                    name: true
                                }
                            },
                            reciever: {
                                columns: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            })
            return res.status(200).send({ success: true, data: getChats })
        }
    } catch (error) {
        console.error(error, "error getting users");
        return res.status(500).send({ error: error, message: "Something went wrong" })
    }
}

export const getConnectUsers = async (req: Request, res: Response) => {
    try {
        const { id } = req.decoded
        const getUsers = await db.query.SocketRoom.findMany({
            where: or(eq(SocketRoom.senderId, id), eq(SocketRoom.recieverId, id)),
            with: {
                sender: {
                    columns: {
                        password: false,
                        createdAt: false
                    }
                },
                reciever: {
                    columns: {
                        password: false,
                        createdAt: false
                    }
                }
            }
        })
        return res.status(200).send({ success: true, data: getUsers })
    } catch (error) {
        console.error(error, "error getting users");
        return res.status(500).send({ error: error, message: "Something went wrong" })
    }
}