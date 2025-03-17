CREATE TABLE `candidates` (
	`userId` int NOT NULL,
	`resume` varchar(1000) NOT NULL,
	`phoneNumber` varchar(255),
	`salaryExpectation` varchar(255),
	`currencyType` enum('USD','EUR','GBP','INR','JPY'),
	`salaryPeriod` enum('annual','monthly'),
	`employmentType` enum('Full Time','Part Time','Internship','Freelance','Contract'),
	`preferredRole` json,
	`availability` enum('immediate','15days','1month','2months','3months','summer'),
	`proficientSkills` json DEFAULT ('[]'),
	`otherSkills` json DEFAULT ('[]'),
	`isComplete` boolean NOT NULL DEFAULT false,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `candidates_userId` PRIMARY KEY(`userId`)
);
--> statement-breakpoint
CREATE TABLE `chat_inputs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`input` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_inputs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`response` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_responses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `education` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseName` varchar(255) NOT NULL,
	`instituteName` varchar(255) NOT NULL,
	`startDate` date NOT NULL,
	`endDate` date,
	CONSTRAINT `education_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`jobTitle` varchar(255) NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`startDate` date NOT NULL,
	`endDate` date,
	`description` text,
	CONSTRAINT `experiences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `job_applications` (
	`applicantId` int NOT NULL,
	`jobId` char(36) NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `job_applications_applicantId_jobId_pk` PRIMARY KEY(`applicantId`,`jobId`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` char(36) NOT NULL,
	`createdBy` int,
	`title` varchar(255) NOT NULL,
	`description` varchar(1000) NOT NULL,
	`salaryRange` varchar(255) NOT NULL,
	`contactEmail` varchar(255) NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`applicationDeadline` date,
	`contactPhone` varchar(255),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`),
	CONSTRAINT `jobs_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectTitle` varchar(255) NOT NULL,
	`startDate` date NOT NULL,
	`endDate` date,
	`description` text,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ranked_candidates` (
	`candidateId` int NOT NULL,
	`listId` int NOT NULL,
	`score` int NOT NULL,
	CONSTRAINT `ranked_candidates_listId_candidateId_pk` PRIMARY KEY(`listId`,`candidateId`)
);
--> statement-breakpoint
CREATE TABLE `ranked_lists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ranked_lists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `structured_query` (
	`sessionId` int NOT NULL,
	`preferred_skills` json DEFAULT ('[]'),
	`experience_level` varchar(255),
	`salary_expectations` varchar(255),
	`employment_type` varchar(255),
	`current_job_status` varchar(255),
	`job_responsibilities` varchar(255),
	`query` text,
	CONSTRAINT `structured_query_sessionId` PRIMARY KEY(`sessionId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`role` enum('recruiter','candidate') NOT NULL,
	`image` varchar(1000),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `candidates` ADD CONSTRAINT `candidates_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_inputs` ADD CONSTRAINT `chat_inputs_sessionId_chat_sessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `chat_sessions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_responses` ADD CONSTRAINT `chat_responses_sessionId_chat_sessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `chat_sessions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_sessions` ADD CONSTRAINT `chat_sessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `education` ADD CONSTRAINT `education_userId_candidates_userId_fk` FOREIGN KEY (`userId`) REFERENCES `candidates`(`userId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `experiences` ADD CONSTRAINT `experiences_userId_candidates_userId_fk` FOREIGN KEY (`userId`) REFERENCES `candidates`(`userId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `job_applications` ADD CONSTRAINT `job_applications_applicantId_candidates_userId_fk` FOREIGN KEY (`applicantId`) REFERENCES `candidates`(`userId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `job_applications` ADD CONSTRAINT `job_applications_jobId_jobs_id_fk` FOREIGN KEY (`jobId`) REFERENCES `jobs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_userId_candidates_userId_fk` FOREIGN KEY (`userId`) REFERENCES `candidates`(`userId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ranked_candidates` ADD CONSTRAINT `ranked_candidates_candidateId_candidates_userId_fk` FOREIGN KEY (`candidateId`) REFERENCES `candidates`(`userId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ranked_candidates` ADD CONSTRAINT `ranked_candidates_listId_ranked_lists_id_fk` FOREIGN KEY (`listId`) REFERENCES `ranked_lists`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ranked_lists` ADD CONSTRAINT `ranked_lists_sessionId_chat_sessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `chat_sessions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `structured_query` ADD CONSTRAINT `structured_query_sessionId_chat_sessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `chat_sessions`(`id`) ON DELETE no action ON UPDATE no action;