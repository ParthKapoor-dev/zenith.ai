"use server";

import { db } from "@/db";
import schema from "@/db/schema/_index";
import { verifySession } from "@/lib/session";
import { ChatInput, ChatResponse } from "@/types/chatbot";

export default async function saveChat(
    userInput: ChatInput,
    resp: ChatResponse
) {
    try {

        console.log(userInput);
        console.log(resp);

        await verifySession();

        await db.insert(schema.ChatInputs).values({
            sessionId: userInput.sessionId,
            input: userInput.input,
        });

        await db.insert(schema.ChatResponses).values({
            sessionId: userInput.sessionId,
            response: resp.response,
        });

        console.log("Log Saved");
    } catch (error: any) {
        console.log(error)
        console.log(error.response)
        throw new Error(error.message);
    }
}
