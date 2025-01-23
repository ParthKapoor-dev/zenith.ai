CREATE TABLE `ranked_list` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ranked_list_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `ranked_candidates` DROP FOREIGN KEY `ranked_candidates_chatSessionId_chat_sessions_id_fk`;
--> statement-breakpoint
ALTER TABLE `ranked_candidates` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `ranked_candidates` ADD PRIMARY KEY(`listId`,`candidateId`);--> statement-breakpoint
ALTER TABLE `ranked_candidates` ADD `listId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `ranked_list` ADD CONSTRAINT `ranked_list_sessionId_chat_sessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `chat_sessions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ranked_candidates` ADD CONSTRAINT `ranked_candidates_listId_ranked_list_id_fk` FOREIGN KEY (`listId`) REFERENCES `ranked_list`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ranked_candidates` DROP COLUMN `chatSessionId`;--> statement-breakpoint
ALTER TABLE `ranked_candidates` DROP COLUMN `updatedAt`;--> statement-breakpoint
ALTER TABLE `ranked_candidates` DROP COLUMN `createdAt`;