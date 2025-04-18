import { relations } from "drizzle-orm";

import { Users } from "./user";
import { Candidates, Education, Experiences, Projects } from "./candidate";
import {
  ChatSessions,
  ChatInputs,
  ChatResponses,
  RankedLists,
  RankedCandidates,
  StructuredQuery,
} from "./recruiter";
import { JobApplications, Jobs } from "./jobs";

// User
export const UsersRelations = relations(Users, ({ one, many }) => ({
  candidate: one(Candidates),
  sessions: many(ChatSessions),
  createdJobs: many(Jobs),
}));

// Candidate
export const CandidateRelations = relations(Candidates, ({ one, many }) => ({
  user: one(Users, { fields: [Candidates.userId], references: [Users.id] }),
  experiences: many(Experiences),
  projects: many(Projects),
  education: many(Education),
  applications: many(JobApplications),
  rankings: many(RankedCandidates),
}));

export const ExperienceRelations = relations(Experiences, ({ one }) => ({
  candidate: one(Candidates, {
    fields: [Experiences.userId],
    references: [Candidates.userId],
  }),
}));

export const ProjectRelations = relations(Projects, ({ one }) => ({
  candidate: one(Candidates, {
    fields: [Projects.userId],
    references: [Candidates.userId],
  }),
}));

export const EducationRelations = relations(Education, ({ one }) => ({
  candidate: one(Candidates, {
    fields: [Education.userId],
    references: [Candidates.userId],
  }),
}));

// Recruiter
export const ChatSessionRelations = relations(
  ChatSessions,
  ({ one, many }) => ({
    user: one(Users, { fields: [ChatSessions.userId], references: [Users.id] }),
    structuredQuery: one(StructuredQuery),
    rankedLists: many(RankedLists),
    chatInputs: many(ChatInputs),
    chatResponses: many(ChatResponses),
  })
);

export const StructuredQueryRelations = relations(
  StructuredQuery,
  ({ one }) => ({
    session: one(ChatSessions, {
      fields: [StructuredQuery.sessionId],
      references: [ChatSessions.id],
    }),
  })
);

export const ChatInputsRelations = relations(ChatInputs, ({ one }) => ({
  session: one(ChatSessions, {
    fields: [ChatInputs.sessionId],
    references: [ChatSessions.id],
  }),
}));

export const ChatResponsesRelations = relations(ChatResponses, ({ one }) => ({
  session: one(ChatSessions, {
    fields: [ChatResponses.sessionId],
    references: [ChatSessions.id],
  }),
}));

export const RankedListsRelations = relations(RankedLists, ({ one, many }) => ({
  session: one(ChatSessions, {
    fields: [RankedLists.sessionId],
    references: [ChatSessions.id],
  }),
  rankedCandidates: many(RankedCandidates),
}));

export const RankedCandidatesRelations = relations(
  RankedCandidates,
  ({ one }) => ({
    candidate: one(Candidates, {
      fields: [RankedCandidates.candidateId],
      references: [Candidates.userId],
    }),
    list: one(RankedLists, {
      fields: [RankedCandidates.listId],
      references: [RankedLists.id],
    }),
  })
);

// Jobs
export const JobsRelations = relations(Jobs, ({ one, many }) => ({
  recruiter: one(Users, {
    fields: [Jobs.createdBy],
    references: [Users.id],
  }),
  applications: many(JobApplications),
}));

export const JobApplicationsRelations = relations(
  JobApplications,
  ({ one }) => ({
    applicant: one(Candidates, {
      fields: [JobApplications.applicantId],
      references: [Candidates.userId],
    }),
    job: one(Jobs, {
      fields: [JobApplications.jobId],
      references: [Jobs.id],
    }),
  })
);

const schema = {
  Users,
  Candidates,
  ChatSessions,
  StructuredQuery,
  ChatInputs,
  ChatResponses,
  Experiences,
  Projects,
  Education,
  JobApplications,
  Jobs,
  RankedLists,
  RankedCandidates,
};
export default schema;

export {
  Users,
  Candidates,
  ChatSessions,
  StructuredQuery,
  ChatInputs,
  ChatResponses,
  Experiences,
  Projects,
  Education,
  JobApplications,
  Jobs,
  RankedLists,
  RankedCandidates,
};
