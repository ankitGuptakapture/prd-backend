
import { pgTable, varchar, timestamp, serial,boolean } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
const users = pgTable("users", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 256 }),
	email: varchar("email", { length: 256 }).notNull().unique(),
	password: varchar("password", { length: 256 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	isOnline:boolean("is_online").default(false).notNull()
});


export default users