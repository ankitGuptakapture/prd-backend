import users from "./User"
import chats from "./Chats"
import { pgTable, serial, timestamp, boolean, integer,text } from "drizzle-orm/pg-core"

const MessageThread = pgTable("message_thread", {
    id: serial("id").primaryKey(),
    title:text("title").notNull(),
    userId: integer("senderId").notNull().references(() => users.id),
    isDeleted: boolean("isDeleted").default(false),
    createdAt: timestamp("createdAt").defaultNow(),
})


export default MessageThread