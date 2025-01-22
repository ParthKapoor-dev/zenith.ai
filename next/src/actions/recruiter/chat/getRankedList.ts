'use server';

import { db } from "@/db";
import schema from "@/db/schema/_index";
import axios from "axios";
import { eq } from "drizzle-orm";

export default async function getRankedList(
    query: string
) {
    const url = process.env.PYTHON_BACKEND + '/recruiters/query'

    try {

        //1. Fetching Query Result
        const { data: { query_result } } = await axios.get(url, { params: { query } });

        //2. Mapping Results, to Respective Users
        const users = await Promise.all(query_result.map(async (item: { id: number }) =>
            await db.query.Candidates.findFirst({
                where: eq(schema.Candidates.userId, item.id),
                with : {
                    user: true
                }
            })))

            console.log(users)

        //3. TODO: Storing this information


        return users;
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