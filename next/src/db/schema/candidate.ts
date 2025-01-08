import { boolean, date, int, json, mysqlEnum, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from './timestamp';
import { Users } from './user';
import { availabilities, currencies, employmentTypes, periods, Role, roles } from './enum';

// Candidate Table
export const Candidates = mysqlTable('candidates', {
    userId: int().primaryKey().references(() => Users.id),
    resume: varchar({ length: 1000 }).notNull(),
    phoneNumber: varchar({ length: 255 }),
    salaryExpectation: varchar({ length: 255 }),
    currencyType: mysqlEnum(currencies),
    salaryPeriod: mysqlEnum(periods),
    employmentType: mysqlEnum(employmentTypes),
    preferredRole: json().$type<Role[]>(),
    availability: mysqlEnum(availabilities),
    proficientSkills: json().$type<string[]>().default([]),
    otherSkills: json().$type<string[]>().default([]),
    isComplete : boolean().notNull().default(false),
    ...timestamps,
});


// Experiences Table
export const Experiences = mysqlTable('experiences', {
    id: int().primaryKey().autoincrement(),
    userId: int().notNull().references(() => Candidates.userId),
    jobTitle: varchar({ length: 255 }).notNull(),
    companyName: varchar({ length: 255 }).notNull(),
    startDate: date().notNull(),
    endDate: date(),
    description: text(),
});


// Education Table
export const Education = mysqlTable('education', {
    id: int().primaryKey().autoincrement(),
    userId: int().notNull().references(() => Candidates.userId),
    courseName: varchar({ length: 255 }).notNull(),
    instituteName: varchar({ length: 255 }).notNull(),
    startDate: date().notNull(),
    endDate: date(),
});


// Projects Table
export const Projects = mysqlTable('projects', {
    id: int().primaryKey().autoincrement(),
    userId: int().notNull().references(() => Candidates.userId),
    projectTitle: varchar({ length: 255 }).notNull(),
    startDate: date().notNull(),
    endDate: date(),
    description: text(),
});