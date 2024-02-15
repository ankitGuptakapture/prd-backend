
import { serial, pgTable, integer, varchar, timestamp } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import Chats from "./Chats"

const SocketRoom = pgTable("socketRoom", {
    id: serial("id").primaryKey(),
    socketId: varchar("socketId").notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
})



export const socketRoomRelations = relations(SocketRoom, (({ many }) => {
    return {
        chatRooms: many(Chats),
    }
}))


export default SocketRoom


