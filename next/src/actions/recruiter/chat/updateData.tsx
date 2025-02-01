"use server";

import { db } from "@/db";
import schema from "@/db/schema/_index";
import { verifySession } from "@/lib/session";
import { eq } from "drizzle-orm";

export default async function updateData(
  sessionId: number,
  data: any | null,
  query: string | null
) {
  try {
    await verifySession();

    if (
      data &&
      data.experience_level &&
      typeof data.experience_level != "string"
    )
      return;

    console.log(data);

    await db
      .update(schema.StructuredQuery)
      .set({
        preferred_skills: data?.preferred_skills,
        experience_level: data?.experience_level,
        salary_expectations: data?.salary_expectations,
        employment_type: data?.employment_type,
        current_job_status: data?.current_job_status,
        job_responsibilities: data?.job_responsibilities,
        query,
      })
      .where(eq(schema.StructuredQuery.sessionId, sessionId));
  } catch (error) {
    throw new Error(error as string);
  }
}
