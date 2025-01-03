'use server';

import { db } from "@/db";
import schema from "@/db/schema/_index";
import { verifySession } from "@/lib/session";
import { Job } from "@/types/job";
import { eq} from "drizzle-orm";

export default async function getAllJobs() {

    try {

        const { user } = await verifySession();

        const jobs = await db.select()
            .from(schema.Jobs)
            .where(eq(schema.Jobs.createdBy, user.id));

        return jobs as Job[];

    } catch (error) {
        throw error;
    }

}