'use server';

import { db } from "@/db";
import schema from "@/db/schema/_index";
import Candidate from "@/types/candidate";
import axios from "axios";
import { eq } from "drizzle-orm";

export default async function finalizeAccount(
    userInfo: Candidate
) {

    const url = process.env.PYTHON_BACKEND + '/candidates/';

    try {

        // 1. Update Candidate Preferences in DB
        await db.update(schema.Candidates).set({
            salaryExpectation: userInfo.salaryExpectation,
            currencyType: userInfo.currencyType,
            salaryPeriod: userInfo.salaryPeriod,
            employmentType: userInfo.employmentType,
            preferredRole: userInfo.preferredRole,
            availability: userInfo.availability
        })

        // 2. Get Full List of Candidate Information
        const candidate = await db.query.Candidates.findFirst({
            where: eq(schema.Candidates.userId, userInfo.userId),
            with: {
                experiences: true,
                projects: 
                true
            }
        });

        // 3. Vectorize Candidate
        await axios.post(url, candidate);

        // 4. Complete The Process
        await db.update(schema.Candidates).set({
            isComplete: true
        })

    } catch (error: any) {

        // 5. Handle Error
        console.log(error);
        throw error
    }
}