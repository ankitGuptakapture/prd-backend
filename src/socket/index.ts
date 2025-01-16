import { Socket } from "socket.io";
import db from "../drizzle";
import Chats from "../models/Chats";
import SocketRoom from "../models/SocketRoom";
import { eq } from "drizzle-orm";
import users from "../models/User";
import { Server } from "http";
import { SocketServer } from "..";
interface Iuser {
  senderId: number;
  recieverId: number;
  message: string;
  socketRoom: string;
  reciverRoom: string;
}

class SocketRooms {
  io:SocketServer
  constructor(io:SocketServer) {
    this.io = io
  }

  async userOnline(useremail: string, socket: Socket) {
    socket.join(useremail)
    socket.broadcast.emit("user:active", useremail)
    await db.update(users).set({ isOnline: true }).where(eq(users.email, useremail))
  }


  sendMessage(message: Iuser) {
    this.io.to(message.reciverRoom).emit("incoming:message", message)
  }

  async userDisconnect(useremail: string,socket:Socket) {
    socket.leave(useremail)
    socket.broadcast.emit("user:deactive", useremail)
    await db.update(users).set({ isOnline: false }).where(eq(users.email, useremail))
  }

}


const createSocketInit = (io: SocketServer) => {
  return (socket: Socket) => {
    const socketInstance = new SocketRooms(io);
    
    socket.on("user:online", (email: string) => 
      socketInstance.userOnline(email, socket)
    );
    
    socket.on("user:disconnect", (email: string) => 
      socketInstance.userDisconnect(email, socket)
    );
    
    socket.on("message:send", (message: Iuser) => {
      socketInstance.sendMessage(message);
    });
  };
};

export default createSocketInit;
