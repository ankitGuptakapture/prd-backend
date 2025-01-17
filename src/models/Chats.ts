// import users from "./User"
// import { pgTable, serial, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core"
// import { relations } from "drizzle-orm"
// import SocketRoom from "./SocketRoom"
// const Chats = pgTable("chats", {
//     id: serial("id").primaryKey(),
//     senderId: integer("senderId").notNull().references(() => users.id),
//     recieverId: integer("recieverId").notNull().references(() => users.id),
//     message: varchar("message").notNull(),
//     socketRoom: integer("socketRoom").notNull().references(() => SocketRoom.id),
//     isDeleted: boolean("isDeleted").default(false),
//     createdAt: timestamp("createdAt").defaultNow(),
// })


// export default Chats

