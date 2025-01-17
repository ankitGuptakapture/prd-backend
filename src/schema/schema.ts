
import { relations } from "drizzle-orm"
import users from "@/models/User"
// export const userRelations = relations(users, ({ many }) => {
//     return { userChats: many(Chats) }
// });
// export const chatRelations = relations(Chats, (({ one }) => {
//     return {
//         sender: one(users, {
//             fields: [Chats.senderId],
//             references: [users.id]
//         })
//     }
// }))
// export const chatRelationReciver = relations(Chats, (({ one }) => {
//     return {
//         reciever: one(users, {
//             fields: [Chats.recieverId],
//             references: [users.id]
//         })
//     }
// }))
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


export { users } 