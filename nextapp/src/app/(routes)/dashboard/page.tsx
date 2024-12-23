import CandidateDash from "@/components/candidate/CandDash";
import CandOnBoardPage from "@/components/candidate/CandOnBoard";
import { db } from "@/db";
import schema from "@/db/schema";
import { verifySession } from "@/lib/session"
import Candidate from "@/types/candidate";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";


export default async function Dash() {

    const session = await verifySession();
    if (!session.user) redirect('/');

    const role = session.user.role;

    let roleInfo = null;
    if (role == 'candidate')
        roleInfo = await db.query.Candidate.findFirst({
            where: eq(schema.Candidate.userId, session.user.id)
        })

    return (
        <div className="h-full">
            {role == 'candidate' && (
                roleInfo
                    ? <CandidateDash candidate={roleInfo} user={session.user} />
                    : <CandOnBoardPage />
            )}

        </div>
    )
}