"use server";

import { db } from "@/db";
import schema from "@/db/schema/_index";
import { verifySession } from "@/lib/session";
import Candidate from "@/types/candidate";
import axios from "axios";
import { eq } from "drizzle-orm";

export default async function finalizeAccount(userInfo: Candidate) {
  const url = process.env.PYTHON_BACKEND + "/candidates";

  try {
    const { user } = await verifySession();

    // 1. Update Candidate Preferences in DB
    await db
      .update(schema.Candidates)
      .set({
        salaryExpectation: userInfo.salaryExpectation,
        currencyType: userInfo.currencyType,
        salaryPeriod: userInfo.salaryPeriod,
        employmentType: userInfo.employmentType,
        preferredRole: userInfo.preferredRole,
        availability: userInfo.availability,
      })
      .where(eq(schema.Candidates.userId, user.id));

    // 2. Get Full List of Candidate Information
    const candidate = await db.query.Candidates.findFirst({
      where: eq(schema.Candidates.userId, userInfo.userId),
      with: {
        experiences: true,
        projects: true,
        education: true,
      },
    });

    // 3. Vectorize Candidate
    await axios.post(url, candidate, {
      headers: { "Content-Type": "application/json" },
    });

    // 4. Complete The Process
    await db
      .update(schema.Candidates)
      .set({
        isComplete: true,
      })
      .where(eq(schema.Candidates.userId, user.id));
  } catch (error: any) {
    // 5. Handle Error
    console.log(error);
    console.log(error?.response?.data);
    throw error;
  }
}
