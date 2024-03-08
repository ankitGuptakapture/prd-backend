import type { Socket } from "socket.io";
import db from "../drizzle";
import Chats from "../models/Chats";
import SocketRoom from "../models/SocketRoom";
import { eq } from "drizzle-orm";
interface Iuser {
  senderId: number;
  recieverId: number;
  message: string;
  socketRoom: string;
  reciverRoom: string;
}

// {
//     "id": 3,
//     "socketId": "john@123hexabells.com|sandra@123gmail.com",
//     "senderId": 1,
//     "recieverId": 3,
//     "createdAt": "2024-02-20T05:26:30.975Z",
//     "sender": {
//         "id": 1,
//         "name": "John",
//         "email": "john@123hexabells.com"
//     },
//     "reciever": {
//         "id": 3,
//         "name": "Sandra",
//         "email": "sandra@123gmail.com"
//     }
// }
const sendMessage = async (user: Iuser, socket: Socket) => {
  try {
    const findSockedId = await db.query.SocketRoom.findFirst({
      where: eq(SocketRoom.socketId, user.socketRoom),
    });
    if (findSockedId) {
      const message = await db
        .insert(Chats)
        .values({
          senderId: user.senderId,
          recieverId: user.recieverId,
          message: user.message,
          socketRoom: findSockedId?.id,
        })
        .returning();
      if (message) {
        socket.to(user.socketRoom).emit("recieve:private:message", {
          ...message[0],
          sender: {
            id: user.senderId,
            name: "",
            email: "",
          },
          reciever: {
            id: user.recieverId,
            name: "",
            email: "",
          },
        });
      }
      return message[0];
    }
  } catch (error) {
    console.error(error);
  }
};

const scoketInit = (socket: Socket) => {
  socket.on("join", (roomNameWithEmail: string) => {
    console.log("joined", roomNameWithEmail);
    socket.join(roomNameWithEmail);
  });
  socket.on(
    "private:chat",
    async ({
      roomName,
      userEmail,
      senderId,
      recieverId,
    }: {
      roomName: string;
      userEmail: string;
      senderId: number;
      recieverId: number;
    }) => {
      try {
        const notifyUser = userEmail;
        const existingRoom = await db.query.SocketRoom.findFirst({
          where: eq(SocketRoom.socketId, roomName),
        });
        if (!existingRoom) {
          await db
            .insert(SocketRoom)
            .values({ socketId: roomName, senderId, recieverId });
          socket.join(roomName);
        }
        socket.to(notifyUser).emit("incoming:messgae", roomName);
      } catch (error) {
        console.error(error);
      }
    }
  );
  socket.on("message:send", async (message: Iuser) => {
    socket.to(message.reciverRoom).emit("incoming:messgae", message.socketRoom);
    sendMessage(message, socket);
  });
  socket.on(
    "video:call",
    ({ id, roomName }: { id: string; roomName: string }) => {
        console.log("revceived",id,roomName);
        
      socket.to(roomName).emit("incoming:videocall", { id, roomName });
    }
  );
};

export default scoketInit;
