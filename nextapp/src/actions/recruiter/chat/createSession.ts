"use server"

import { db } from "@/db";
import schema from "@/db/schema";
import { verifySession } from "@/lib/session"
import { ChatSession } from "@/types/chatbot";
import { eq } from "drizzle-orm";

export default async function createChatSession(
    title?: string
) {

    try {

        const session = await verifySession();
        const user = session.user;

        const chatSession = await db.insert(schema.ChatSessions).values({
            userId: user.id,
            title: title || new Date().toString()
        }).$returningId();

        return chatSession[0].id;

    } catch (error) {
        throw new Error(error as string)
    }


}