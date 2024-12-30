'use server';

import { db } from "@/db";
import schema from "@/db/schema/_index";
import { verifySession } from "@/lib/session";
import Candidate from "@/types/candidate";
import { eq } from "drizzle-orm";

export default async function fetchCandidate() {

    try {

        const session = await verifySession();
        const userId = session.user.id;

        const candidate = await db.query.Candidates.findFirst({
            where: eq(schema.Candidates.userId, userId),
            with: {
                experiences : true,
                projects : true,
                // user : true
            }
        }) as Candidate | undefined;

        // candidate.experiences = [];
        // candidate.projects = [];
        // candidate.proficientSkills = [];
        // candidate.otherSkills = []

        console.log("Candidate is ", candidate)

        return candidate;

    } catch (error) {
        console.log("Error Occoured", error);
        throw error;
    }

}