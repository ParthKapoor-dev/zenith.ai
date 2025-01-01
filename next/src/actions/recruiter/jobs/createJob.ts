'use server';

import { db } from "@/db";
import schema from "@/db/schema/_index";
import { verifySession } from "@/lib/session";
import { Job } from "@/types/job";

export default async function createJob(
    jobData: Job
) {

    try {

        const session = await verifySession();
        const recruiterId = session.user.id;

        if (session.user.role !== 'recruiter')
            throw new Error("Only a Recruiter can Create a Job Posting");

        await db.insert(schema.Jobs).values({
            id: jobData.id,
            title: jobData.title,
            companyName: jobData.companyName,
            createdBy: recruiterId,
            description: jobData.description,
            salaryRange: jobData.salaryRange,
            contactEmail: jobData.contactEmail,
            applicationDeadline: jobData.applicationDeadline,
            contactPhone: jobData.contactPhone,
        })


    } catch (error) {
        throw error;
    }
}