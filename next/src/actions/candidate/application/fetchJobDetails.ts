'use server'

import { db } from "@/db";
import schema from "@/db/schema/_index";
import { verifySession } from "@/lib/session"
import { eq } from "drizzle-orm";

export default async function fetchJobDetails(
    jobId: string
) {
    try {

        const { user } = await verifySession();

        const job = await db.query.Jobs.findFirst({
            where: eq(schema.Jobs.id, jobId),
            with: {
                applications: {
                    where: eq(schema.JobApplications.applicantId, user.id)
                }
            }
        });

        if (!job) throw new Error("Invalid Job ID");

        return job;

    } catch (error) {
        throw error;
    }

}