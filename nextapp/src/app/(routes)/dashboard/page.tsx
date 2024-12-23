import CandidateDash from "./CandDash";
import { db } from "@/db";
import schema from "@/db/schema";
import { verifySession } from "@/lib/session"
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";


export default async function Dash() {

    const session = await verifySession();
    if (!session.user) redirect('/');

    const role = session.user.role;

    let roleInfo = null;
    if (role == 'candidate') {
        roleInfo = await db.query.Candidates.findFirst({
            where: eq(schema.Candidates.userId, session.user.id)
        });
        if (!roleInfo) redirect('/onboarding/resume');
    }

    return (
        <div className="h-full">
            {role == 'candidate' && (
                <CandidateDash candidate={roleInfo!} user={session.user} />
            )}

        </div>
    )
}