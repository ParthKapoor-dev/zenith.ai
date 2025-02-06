"use server";

import { db } from "@/db";
import schema from "@/db/schema/_index";
import { verifySession } from "@/lib/session";
import { RankedList, ChatInput, ChatResponse } from "@/types/chatbot";
import axios from "axios";
import { eq } from "drizzle-orm";

export default async function getRankedList(
  messages: (RankedList | ChatInput | ChatResponse)[],
  structured_data: Record<string, any> | null,
  sessionId: number
): Promise<RankedList> {
  const url = process.env.PYTHON_BACKEND + "/recruiters/query";

  try {
    console.log("SessionId", sessionId);

    //0. Auth
    await verifySession();

    const msgs = messages.filter(
      (item) => (item as ChatInput).input || (item as ChatResponse).response
    );

    console.log(msgs);

    //1. Fetching Query Result
    const {
      data: { query_result },
    } = await axios.post(url, {
      messages: msgs,
      // query,
      // structured_data: structured_data,
    });

    // process.nextTick(async () => {

    const [{ id: listId }] = await db
      .insert(schema.RankedLists)
      .values({ sessionId })
      .$returningId();

    await Promise.all(
      query_result.map(
        async (item: { id: number; score: number }) =>
          await db.insert(schema.RankedCandidates).values({
            candidateId: item.id,
            score: item.score,
            listId,
          })
      )
    );
    // })

    const rankedList = (await db.query.RankedLists.findFirst({
      where: eq(schema.RankedLists.id, listId),
      with: {
        rankedCandidates: { with: { candidate: { with: { user: true } } } },
      },
    })) as RankedList;

    return rankedList;
  } catch (error: any) {
    console.log(error?.response?.data);
    throw new Error(error.message);
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
