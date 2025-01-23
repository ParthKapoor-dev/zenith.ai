RENAME TABLE `ranked_list` TO `ranked_lists`;--> statement-breakpoint
ALTER TABLE `ranked_candidates` DROP FOREIGN KEY `ranked_candidates_listId_ranked_list_id_fk`;
--> statement-breakpoint
ALTER TABLE `ranked_lists` DROP FOREIGN KEY `ranked_list_sessionId_chat_sessions_id_fk`;
--> statement-breakpoint
ALTER TABLE `ranked_lists` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `ranked_lists` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `ranked_candidates` ADD CONSTRAINT `ranked_candidates_listId_ranked_lists_id_fk` FOREIGN KEY (`listId`) REFERENCES `ranked_lists`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ranked_lists` ADD CONSTRAINT `ranked_lists_sessionId_chat_sessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `chat_sessions`(`id`) ON DELETE no action ON UPDATE no action;