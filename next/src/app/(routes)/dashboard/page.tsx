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
        try {
            roleInfo = await db.query.Candidates.findFirst({
                where: eq(schema.Candidates.userId, session.user.id),
                with: {
                    experiences: true,
                    projects: true,
                }
            }) as Candidate | undefined
        } catch (error) {
            console.log("Unexpected Error Occoured ", error)
        }
        if (!roleInfo?.isComplete) redirect('/onboarding/resume');
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