
import { relations } from "drizzle-orm"
import users from "@/models/User"
import Chats from "@/models/Chats"
import MessageThread from "@/models/MessageThread"
import Project from "@/models/Project"
export const userRelations = relations(users, ({ many }) => {
    return { userChats: many(Chats) }
});
export const messageThreadWithUser = relations(users, (({ many }) => {
    return {
        messages: many(MessageThread,)
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

export const projectWithChats = relations(Project, ({ many }) => ({
    chats: many(Chats, { relationName: 'projectChats' })
}));


export const chatsWithProject = relations(Chats, ({ one }) => ({
    chatsWithProject: one(Project, {
       fields: [Chats.projectId],
       references: [Project.id],
       relationName: 'projectChats'
    })
}));




export { users,Chats,MessageThread,Project } 