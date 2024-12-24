"use server"

import { db } from "@/db";
import schema from "@/db/schema";
import { verifySession } from "@/lib/session"
import { ChatInput, ChatResponse, ChatSession } from "@/types/chatbot";
import { eq } from "drizzle-orm";

export default async function getSession(
    sessionId: number
) {

    try {

        const inputs = await db.query.ChatInputs.findMany({
            where: eq(schema.ChatInputs.sessionId, sessionId)
        }) as ChatInput[];

        const responses = await db.query.ChatResponses.findMany({
            where: eq(schema.ChatResponses.sessionId, sessionId)
        }) as ChatResponse[];

        const sortedArray = [...inputs, ...responses].sort((a, b) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });

        return sortedArray;


    } catch (error) {
        throw new Error(error as string)
    }


}