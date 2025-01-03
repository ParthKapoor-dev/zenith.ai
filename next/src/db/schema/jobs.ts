import { char, date, int, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";
import { timestamps } from "./timestamp";
import { Users } from "./user";
import { Candidates } from "./candidate";

// Job Postings
export const Jobs = mysqlTable('jobs', {
    id: char({ length: 36 }).notNull().unique().primaryKey(),
    createdBy: int().references(() => Users.id),
    title: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 1000 }).notNull(),
    salaryRange: varchar({ length: 255 }).notNull(),
    contactEmail: varchar({ length: 255 }).notNull(),
    companyName: varchar({ length: 255 }).notNull(),
    applicationDeadline: date(),
    contactPhone: varchar({ length: 255 }),
    ...timestamps
});

// Candidate's Application to Job
export const JobApplications = mysqlTable('jobApplications', {
    applicantId: int().notNull().references(() => Candidates.userId),
    jobId: char({ length: 36 }).notNull().references(() => Jobs.id),
    ...timestamps
}, (table) => ([
    primaryKey({ columns: [table.applicantId, table.jobId] }),
]));
