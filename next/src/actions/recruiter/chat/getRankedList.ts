'use server';

import { db } from "@/db";
import schema from "@/db/schema/_index";
import { verifySession } from "@/lib/session";
import { RankedList } from "@/types/chatbot";
import axios from "axios";
import { eq } from "drizzle-orm";

export default async function getRankedList(
    query: string,
    sessionId: number
): Promise<RankedList> {
    const url = process.env.PYTHON_BACKEND + '/recruiters/query'

    try {

        console.log("SessionId", sessionId)

        //0. Auth
        await verifySession();

        //1. Fetching Query Result
        const { data: { query_result } } = await axios.get(url, { params: { query } });

        // process.nextTick(async () => {

        const [{ id: listId }] = await db.insert(schema.RankedLists)
            .values({ sessionId }).$returningId();

        await Promise.all(query_result.map(async (item: { id: number, score: number }) =>
            await db.insert(schema.RankedCandidates).values({
                candidateId: item.id,
                score: item.score,
                listId
            })))
        // })

        const rankedList = await db.query.RankedLists.findFirst({
            where: eq(schema.RankedLists.id, listId),
            with: { rankedCandidates: { with: { candidate: { with: { user: true } } } } }
        }) as RankedList;

        return rankedList;

    } catch (error: any) {
        throw new Error(error.message)
    }
}

// {
//     query_result: [
//         {
//             id: '3',
//             score: 0.53209966,
//             vector: null,
//             metadata: null,
//             data: null
//         }
//     ]
// }