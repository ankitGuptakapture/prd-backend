import {pgTable,serial,text,integer,date,varchar} from "drizzle-orm/pg-core"
import users from "./User"

const Project = pgTable("project", {
    id:serial("id").primaryKey(),
    name:text("name").notNull().default(""),
    description:text("description").default(""),
    userId:integer("userId").references(()=>users.id).notNull(),
    createdAt:date("createdAt").defaultNow(),
    projectDeadline:date("projectDealine"),
    filePath:varchar("filePath")
})

export default Project