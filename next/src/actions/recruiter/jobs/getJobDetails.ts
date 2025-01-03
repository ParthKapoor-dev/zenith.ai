'use server';

import { db } from "@/db";
import schema from "@/db/schema/_index";
import { verifySession } from "@/lib/session";
import { Job } from "@/types/job";
import { count, eq, gt, sql } from "drizzle-orm";

export default async function getJobDetails(
    jobId: string
) {

    try {

        console.log(jobId)

        await verifySession();

        const job = await db.query.Jobs.findFirst({
            where: eq(schema.Jobs.id, jobId)
        }) as Job;

        if (!job) throw new Error("Invalid Job Id");

        // const totalCount = await db.select({ count: count() })
        //     .from(schema.JobApplications)
        //     .where(eq(schema.JobApplications.jobId, jobId));

        const indivCount = await db
            .select({
                date: sql`DATE(${schema.JobApplications.createdAt})`.as('date'),
                count: sql`COUNT(*)`.as('count'),
            })
            .from(schema.JobApplications)
            .where(gt(schema.JobApplications.createdAt, job?.createdAt))
            .groupBy(sql`DATE(${schema.JobApplications.createdAt})`)
            .orderBy(sql`DATE(${schema.JobApplications.createdAt})`)
            .execute();

        return {
            indivCount,
            job
        }

    } catch (error) {
        throw error;
    }

}