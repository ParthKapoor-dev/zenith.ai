'use server'

import { db } from "@/db";
import schema from "@/db/schema/_index";
import { verifySession } from "@/lib/session"
import { eq } from "drizzle-orm";

export interface ActionResponse {

}

export default async function fetchJobDetails(
    jobId: string
) {

    try {

        const session = await verifySession();

        const job = await db.query.Jobs.findFirst({
            where: eq(schema.Jobs.id, jobId),
            with: {
                applications: {
                    where: eq(schema.JobApplications.applicantId, session.user.id)
                }
            }
        });

        if (!job) throw new Error("Invalid Job ID");

        return job;

    } catch (error) {

    }

}