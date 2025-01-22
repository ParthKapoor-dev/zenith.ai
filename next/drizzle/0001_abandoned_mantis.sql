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
RENAME TABLE `chatInputs` TO `chat_inputs`;--> statement-breakpoint
RENAME TABLE `chatResponses` TO `chat_responses`;--> statement-breakpoint
RENAME TABLE `chatSessions` TO `chat_sessions`;--> statement-breakpoint
ALTER TABLE `chat_inputs` DROP FOREIGN KEY `chatInputs_sessionId_chatSessions_id_fk`;
--> statement-breakpoint
ALTER TABLE `chat_responses` DROP FOREIGN KEY `chatResponses_sessionId_chatSessions_id_fk`;
--> statement-breakpoint
ALTER TABLE `chat_sessions` DROP FOREIGN KEY `chatSessions_userId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `chat_inputs` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `chat_responses` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `chat_sessions` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `candidates` MODIFY COLUMN `currencyType` enum('USD','EUR','GBP','INR','JPY');--> statement-breakpoint
ALTER TABLE `candidates` MODIFY COLUMN `proficientSkills` json DEFAULT ('[]');--> statement-breakpoint
ALTER TABLE `candidates` MODIFY COLUMN `otherSkills` json DEFAULT ('[]');--> statement-breakpoint
ALTER TABLE `chat_inputs` MODIFY COLUMN `input` text NOT NULL;--> statement-breakpoint
ALTER TABLE `chat_responses` MODIFY COLUMN `response` text NOT NULL;--> statement-breakpoint
ALTER TABLE `chat_inputs` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `chat_responses` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `chat_sessions` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `candidates` ADD `isComplete` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `education` ADD CONSTRAINT `education_userId_candidates_userId_fk` FOREIGN KEY (`userId`) REFERENCES `candidates`(`userId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `job_applications` ADD CONSTRAINT `job_applications_applicantId_candidates_userId_fk` FOREIGN KEY (`applicantId`) REFERENCES `candidates`(`userId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `job_applications` ADD CONSTRAINT `job_applications_jobId_jobs_id_fk` FOREIGN KEY (`jobId`) REFERENCES `jobs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_inputs` ADD CONSTRAINT `chat_inputs_sessionId_chat_sessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `chat_sessions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_responses` ADD CONSTRAINT `chat_responses_sessionId_chat_sessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `chat_sessions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_sessions` ADD CONSTRAINT `chat_sessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;