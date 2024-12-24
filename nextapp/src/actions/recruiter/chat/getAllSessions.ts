"use server"

import { db } from "@/db";
import schema from "@/db/schema";
import { verifySession } from "@/lib/session"
import { ChatSession } from "@/types/chatbot";
import { eq } from "drizzle-orm";

export default async function getAllSessions() {

    try {

        const session = await verifySession();
        const user = session.user;

        const chatSessions = await db.query.ChatSessions.findMany({
            where: eq(schema.ChatSessions.userId, user.id)
        });

        console.log("GET Chat Sessions : ", chatSessions);

        if (!chatSessions) return [];

        return chatSessions;

    } catch (error) {
        throw new Error(error as string)
    }


}