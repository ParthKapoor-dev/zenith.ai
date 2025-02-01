"use server";

import { db } from "@/db";
import schema from "@/db/schema/_index";
import { verifySession } from "@/lib/session";
import Candidate from "@/types/candidate";
import { eq } from "drizzle-orm";

export default async function updateProfile(userData: Candidate) {
  try {
    const session = await verifySession();
    const user = session.user;

    await db
      .update(schema.Candidates)
      .set({
        proficientSkills: userData.proficientSkills,
        otherSkills: userData.otherSkills,
      })
      .where(eq(schema.Candidates.userId, user.id));

    for (let edu of userData.education) {
      if (edu.id == -1)
        await db.insert(schema.Education).values({
          userId: user.id,
          courseName: edu.courseName,
          instituteName: edu.instituteName,
          startDate: new Date(edu.startDate),
          endDate: edu.endDate ? new Date(edu.endDate) : null,
        });
      else
        await db
          .update(schema.Education)
          .set({
            userId: user.id,
            courseName: edu.courseName,
            instituteName: edu.instituteName,
            startDate: new Date(edu.startDate),
            endDate: edu.endDate ? new Date(edu.endDate) : null,
          })
          .where(eq(schema.Education.id, edu.id));
    }

    for (let exp of userData.experiences) {
      if (exp.id == -1)
        await db.insert(schema.Experiences).values({
          userId: user.id,
          jobTitle: exp.jobTitle,
          companyName: exp.companyName,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : null,
          description: exp.description,
        });
      else
        await db
          .update(schema.Experiences)
          .set({
            userId: user.id,
            jobTitle: exp.jobTitle,
            companyName: exp.companyName,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            description: exp.description,
          })
          .where(eq(schema.Experiences.id, exp.id));
    }

    for (let proj of userData.projects) {
      if (proj.id == -1)
        await db.insert(schema.Projects).values({
          userId: user.id,
          projectTitle: proj.projectTitle,
          startDate: new Date(proj.startDate),
          endDate: proj.endDate ? new Date(proj.endDate) : null,
          description: proj.description,
        });
      else
        await db
          .update(schema.Projects)
          .set({
            userId: user.id,
            projectTitle: proj.projectTitle,
            startDate: new Date(proj.startDate),
            endDate: proj.endDate ? new Date(proj.endDate) : null,
            description: proj.description,
          })
          .where(eq(schema.Projects.id, proj.id));
    }
  } catch (error) {
    throw error;
  }
}
