import MessageThread from "./MessageThread"
import users from "./User"
import { pgTable, serial, timestamp, boolean, integer, text } from "drizzle-orm/pg-core"

const Chats = pgTable("chats", {
    id: serial("id").primaryKey(),
    userId: integer("senderId").references(() => users.id),
    threadId: integer("threadId").notNull().references(()=>MessageThread.id),
    userMessage: text("message"),
    gptResponse: text("gptResponse"),
    isDeleted: boolean("isDeleted").default(false),
    createdAt: timestamp("createdAt").defaultNow(),
})


export default Chats