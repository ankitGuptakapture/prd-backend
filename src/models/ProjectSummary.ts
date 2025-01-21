import {pgTable,serial,text,integer,date,varchar} from "drizzle-orm/pg-core"
import Project from "./Project"
import users from "./User"

const ProjectSummary = pgTable("projectSummary", {
    id:serial("id").primaryKey(),
    summary:text("summary").default(""),
    userId:integer("userId").references(()=>users.id).notNull(),
    projectId:integer("projectId").references(()=>Project.id).notNull(),
    createdAt:date("createdAt").defaultNow(),
    summaryOf:varchar("summaryOf")
})

export default ProjectSummary