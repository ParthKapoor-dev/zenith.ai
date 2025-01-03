import { relations } from 'drizzle-orm';

import { Users } from "./user"
import { Candidates, Experiences, Projects } from './candidate';
import { ChatSessions, ChatInputs, ChatResponses } from './recruiter';
import { JobApplications, Jobs } from './jobs';


// User
export const UsersRelations = relations(Users, ({ one, many }) => ({
    candidate: one(Candidates),
    sessions: many(ChatSessions),
    createdJobs: many(Jobs)
}));


// Candidate
export const CandidateRelations = relations(Candidates, ({ one, many }) => ({
    user: one(Users, { fields: [Candidates.userId], references: [Users.id] }),
    experiences: many(Experiences),
    projects: many(Projects),
    applications: many(JobApplications)
}));

export const ExperienceRelations = relations(Experiences, ({ one }) => ({
    candidate: one(Candidates,
        { fields: [Experiences.userId], references: [Candidates.userId] })
}))

export const ProjectRelations = relations(Projects, ({ one }) => ({
    candidate: one(Candidates,
        { fields: [Projects.userId], references: [Candidates.userId] })
}))


// Recruiter
export const ChatSessionRelations = relations(ChatSessions, ({ one, many }) => ({
    user: one(Users, {
        fields: [ChatSessions.userId], references: [Users.id]
    }),
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


// Jobs
export const JobsRelations = relations(Jobs, ({ one, many }) => ({
    recruiter: one(Users, {
        fields: [Jobs.createdBy], references: [Users.id]
    }),
    applications: many(JobApplications)
}))

export const JobApplicationsRelations = relations(JobApplications, ({ one }) => ({
    applicant: one(Candidates, {
        fields: [JobApplications.applicantId], references: [Candidates.userId]
    }),
    job: one(Jobs, {
        fields: [JobApplications.jobId], references: [Jobs.id]
    })
}))

const schema = {
    Users,
    Candidates,
    ChatSessions,
    ChatInputs,
    ChatResponses,
    Experiences,
    Projects,
    JobApplications,
    Jobs
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
    JobApplications,
    Jobs
} 