import { db } from "@/db";
import schema from "@/db/schema/_index";
import { verifySession } from "@/lib/session";
import Candidate from "@/types/candidate";
import { eq } from "drizzle-orm";


export default async function updateProfile(
    userData: Candidate
) {

    try {

        const session = await verifySession();
        const user = session.user;

        for (let exp of userData.experiences) {
            if (exp.id == -1)
                await db.insert(schema.Experiences).values({
                    userId: user.id,
                    jobTitle: exp.job_title,
                    companyName: exp.company_name,
                    startDate: new Date(exp.start_date),
                    endDate: exp.end_date ? new Date(exp.end_date) : null,
                    description: exp.description
                })
            else await db.update(schema.Experiences).set({
                userId: user.id,
                jobTitle: exp.job_title,
                companyName: exp.company_name,
                startDate: new Date(exp.start_date),
                endDate: exp.end_date ? new Date(exp.end_date) : null,
                description: exp.description
            }).where(eq(schema.Experiences.id, exp.id))
        }

        for (let proj of userData.projects) {
            if (proj.id == -1)
                await db.insert(schema.Projects).values({
                    userId: user.id,
                    projectTitle: proj.project_title,
                    startDate: new Date(proj.start_date),
                    endDate: proj.end_date ? new Date(proj.end_date) : null,
                    description: proj.description
                })
            else await db.update(schema.Projects).set({
                userId: user.id,
                projectTitle: proj.project_title,
                startDate: new Date(proj.start_date),
                endDate: proj.end_date ? new Date(proj.end_date) : null,
                description: proj.description
            }).where(eq(schema.Experiences.id, proj.id))
        }


    } catch (error) {
        throw error;
    }

}