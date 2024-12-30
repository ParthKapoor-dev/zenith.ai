"use server"

import { db } from "@/db";
import schema from "@/db/schema/_index";
import { verifySession } from "@/lib/session";
import { ChatInput } from "@/types/chatbot";

export default async function handelUserInput(
    userInput: ChatInput,
) {
    try {

        //0. get User Session
        const session = await verifySession();
        const user = session.user;

        //1. TODO : Fetch Bot Response using python API
        await new Promise(resolve => setTimeout(resolve, 1500));
        const botResp = "I'll help you find the perfect candidates for this position. Could you please provide more details about the required skills and experience?";


        //2. SaveChatLog :Add User Input && Bot Response in the Background
        process.nextTick(async () => {
            await db.insert(schema.ChatInputs).values({
                sessionId: userInput.sessionId,
                input: userInput.input
            })

            await db.insert(schema.ChatResponses).values({
                sessionId: userInput.sessionId,
                response: botResp
            })
            console.log("Log Saved");
        })

        console.log("Sending Back BotResp");
        return botResp;
    } catch (error: any) {
        throw new Error(error.message)
    }
}