import type { Socket } from "socket.io"
import db from "../drizzle"
import Chats from "../models/Chats"
interface Iuser {
    senderId: number,
    recieverId: number,
    message: string,
    socketRoom: number
}

// const rooms = {}
const sendMessage = async (user: Iuser, socket: Socket) => {
    try {
        const message = await db.insert(Chats).values(user).returning()
        return message[0]
    } catch (error) {
        console.error(error);
    }
}
// 1 | 2
const scoketInit = (socket: Socket) => {
    socket.on("join",(roomName:string)=>{
        socket.join(roomName)
        socket.emit("new:user:message",()=>{

        })
    })
    socket.on("message:send", (message: Iuser) => {
        sendMessage(message, socket)
    })
}

export default scoketInit