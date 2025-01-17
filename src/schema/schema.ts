
import { relations } from "drizzle-orm"
import users from "@/models/User"
import Chats from "@/models/Chats"
import MessageThread from "@/models/MessageThread"
export const userRelations = relations(users, ({ many }) => {
    return { userChats: many(Chats) }
});
export const messageThreadWithUser = relations(MessageThread, (({ one }) => {
    return {
        messages: one(users, {
            fields: [MessageThread.userId],
            references: [users.id]
        })
    }
}))
export const chatsWithMessageThread = relations(Chats, (({ one }) => {
    return {
        chats: one(MessageThread, {
            fields: [Chats.id],
            references: [MessageThread.id]
        })
    }
}))
// export const socketRoomRelations = relations(SocketRoom, (({ many }) => {
//     return {
//         chatRooms: many(Chats),
//     }
// }))
// export const chatSocketRelation = relations(Chats, (({ one }) => {
//     return {
//         socketRoom: one(SocketRoom, {
//             fields: [Chats.socketRoom],
//             references: [SocketRoom.id]
//         })
//     }
// }))

// export const socketRoomUserRelations = relations(SocketRoom,(({one})=>{
//     return {
//         reciever: one(users, {
//             fields: [SocketRoom.recieverId],
//             references: [users.id]
//         })
//     }
// }))

// export const socketRoomUserSenderRelations = relations(SocketRoom,(({one})=>{
//     return {
//         sender: one(users, {
//             fields: [SocketRoom.senderId],
//             references: [users.id]
//         })
//     }
// }))


export { users,Chats,MessageThread } 