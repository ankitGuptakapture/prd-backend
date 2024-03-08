
import { serial, pgTable, integer, varchar, timestamp } from "drizzle-orm/pg-core"


const SocketRoom = pgTable("socketRoom", {
    id: serial("id").primaryKey(),
    socketId: varchar("socketId").notNull(),
    senderId:integer("senderId").notNull(),
    recieverId:integer("recieverId").notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
})


export default SocketRoom


