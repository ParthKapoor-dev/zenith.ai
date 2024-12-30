import { relations } from 'drizzle-orm';

import { Users } from "./user"
import { Candidates, Experiences, Projects, Skills } from './candidate';
import { ChatSessions, ChatInputs, ChatResponses } from './recruiter';


// User
export const UsersRelations = relations(Users, ({ one, many }) => ({
    candidate: one(Candidates),
    sessions: many(ChatSessions)
}));


// Candidate
export const CandidateRelations = relations(Candidates, ({ one, many }) => ({
    user: one(Users, { fields: [Candidates.userId], references: [Users.id] }),
    experiences: many(Experiences),
    projects: many(Projects),
    skills: many(Skills)
}));

export const ExperienceRelations = relations(Experiences, ({ one }) => ({
    candidate: one(Candidates,
        { fields: [Experiences.userId], references: [Candidates.userId] })
}))

export const ProjectRelations = relations(Projects, ({ one }) => ({
    candidate: one(Candidates,
        { fields: [Projects.userId], references: [Candidates.userId] })
}))

export const SkillRelations = relations(Skills, ({ one }) => ({
    candidate: one(Candidates,
        { fields: [Skills.userId], references: [Candidates.userId] })
}))


// Recruiter
export const ChatSessionRelations = relations(ChatSessions, ({ one, many }) => ({
    user: one(Users, { fields: [ChatSessions.userId], references: [Users.id] }),
    chatInputs: many(ChatInputs),
    chatResponses: many(ChatResponses)
}))

export const ChatInputsRelations = relations(ChatInputs, ({ one }) => ({
    session: one(ChatSessions,
        { fields: [ChatInputs.sessionId], references: [ChatSessions.id] })
}))

export const ChatResponsesRelations = relations(ChatResponses, ({ one }) => ({
    session: one(ChatSessions,
        { fields: [ChatResponses.sessionId], references: [ChatSessions.id] })
}))

const schema = {
    Users,
    Candidates,
    ChatSessions,
    ChatInputs,
    ChatResponses,
    Experiences,
    Projects,
    Skills
};
export default schema;

export {
    Users,
    Candidates,
    ChatSessions,
    ChatInputs,
    ChatResponses,
    Experiences,
    Projects,
    Skills
} 