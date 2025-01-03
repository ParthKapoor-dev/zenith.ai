'use server';

import { db } from "@/db";
import schema from "@/db/schema/_index";
import { verifySession } from "@/lib/session";
import { Job } from "@/types/job";
import { and, count, eq, gt, sql } from "drizzle-orm";

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

        const indivCount = await db
            .select({
                date: sql`DATE(${schema.JobApplications.createdAt})`.as('date'),
                count: sql`COUNT(*)`.as('count'),
            })
            .from(schema.JobApplications)
            .where(and(
                gt(schema.JobApplications.createdAt, job?.createdAt),
                eq(schema.JobApplications.jobId, jobId)))
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