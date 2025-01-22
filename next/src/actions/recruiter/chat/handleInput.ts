"use server";

import { db } from "@/db";
import schema from "@/db/schema/_index";
import { verifySession } from "@/lib/session";
import { ChatInput } from "@/types/chatbot";
import axios from "axios";

export default async function handelUserInput(
    userInput: ChatInput,
): Promise<string> {
    const url = process.env.PYTHON_BACKEND + "/recruiters/chat";

    try {
        // 1. Get User Session
        await verifySession();

        //2. Generating Response
        const resp = await axios.post<{ resp: string }>(url, { user_input: userInput.input })
        console.log(resp)
        const botResp = resp.data.resp;

        // 3. Save Chat Log: Add User Input & Bot Response in the Background
        process.nextTick(async () => {
            await db.insert(schema.ChatInputs).values({
                sessionId: userInput.sessionId,
                input: userInput.input,
            });

            await db.insert(schema.ChatResponses).values({
                sessionId: userInput.sessionId,
                response: botResp,
            });

            console.log("Log Saved");
        });

        console.log("Sending Back BotResp");
        return botResp;
    } catch (error: any) {
        console.log(error)
        console.log(error.response)
        throw new Error(error.message);
    }
}
