'use server'

import { db } from "@/db";
import schema from "@/db/schema/_index";
import { verifySession } from "@/lib/session"
import Candidate from "@/types/candidate";
import { Job, JobApplication } from "@/types/job";
import { eq } from "drizzle-orm";

export type ActionResponse = SingleResp[]

interface SingleResp{
    candidates: Candidate,
    jobs: Job,
    jobApplications: JobApplication
}

export default async function getAppliedJobs() {
    try {

        const { user } = await verifySession();

        if (user.role !== 'candidate')
            throw new Error("Only Candidate can get Applications");

        const AppliedJobs = await db.select()
            .from(schema.JobApplications)
            .leftJoin(schema.Jobs, eq(schema.JobApplications.jobId, schema.Jobs.id))
            .leftJoin(schema.Candidates, eq(schema.JobApplications.applicantId, schema.Candidates.userId))
            .where(eq(schema.JobApplications.applicantId, user.id));

        return AppliedJobs as ActionResponse;

    } catch (error) {
        throw error;
    }

}