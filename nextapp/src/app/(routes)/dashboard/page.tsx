import CandidateDash from "./CandDash";
import { db } from "@/db";
import schema from "@/db/schema/_index";
import { verifySession } from "@/lib/session"
import Candidate from "@/types/candidate";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";


export default async function Dash() {

    const session = await verifySession();
    if (!session.user) redirect('/');

    const role = session.user.role;

    let roleInfo = null;
    if (role == 'candidate') {
        roleInfo = await db.query.Candidates.findFirst({
            where: eq(schema.Candidates.userId, session.user.id),
            with: {
                experiences: true,
                projects: true,
                skills: true
            }
        }) as Candidate | undefined
        if (!roleInfo?.salaryExpectation) redirect('/onboarding/resume');
    }

    // TODO : Create Recruiter Dashboard
    if (role == 'recruiter') redirect('/chat')

    return (
        <div className="h-full">
            {role == 'candidate' && (
                <CandidateDash candidate={roleInfo!} user={session.user} />
            )}

        </div>
    )
}