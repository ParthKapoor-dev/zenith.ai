"use server"

import { db } from "@/db";
import schema from "@/db/schema/_index";
import { verifySession } from "@/lib/session"
import { ChatInput, ChatResponse, ChatSession, RankedList } from "@/types/chatbot";
import { eq } from "drizzle-orm";

export default async function getSession(
    sessionId: number
) {

    try {

        await verifySession();

        const session = await db.query.ChatSessions.findFirst({
            where: eq(schema.ChatSessions.id, sessionId),
            with: {
                chatInputs: true,
                chatResponses: true,
                rankedLists:
                    { with: { rankedCandidates: { with: { candidate: { with: { user: true } } } } } }
            }
        })

        const inputs = session?.chatInputs as ChatInput[];
        const responses = session?.chatResponses as ChatResponse[];
        const lists = session?.rankedLists as RankedList[]

        const sortedArray = [...inputs, ...responses, ...lists].sort((a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

        console.log("Sorted Array", sortedArray)

        return sortedArray;


    } catch (error) {
        throw new Error(error as string)
    }


}