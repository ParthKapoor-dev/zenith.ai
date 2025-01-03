'use server';

import { db } from "@/db";
import schema from "@/db/schema/_index";
import { verifySession } from "@/lib/session";

export default async function submitApplication(
    jobId: string
) {

    try {

        const { user } = await verifySession();

        if (user.role !== 'candidate')
            throw new Error("Only Candidate can apply to Job Application")

        await db.insert(schema.JobApplications).values({
            applicantId: user.id,
            jobId: jobId
        })

    } catch (error) {
        console.log(error)
        throw error;
    }

}