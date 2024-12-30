import { Metadata } from "next";
import ProgressBar from "./ProgressBar";
import { verifySession } from "@/lib/session";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import schema from "@/db/schema/_index";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const metadata: Metadata = {};

const steps = {
    resume: '/onboarding/resume',
    validation: '/onboarding/validation',
    final: '/onboarding/final',
};

export default async function OnboardingLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {

    let currentStep = 0;
    const session = await verifySession();
    const candidate = await db.query.Candidates.findFirst({
        where: eq(schema.Candidates.userId, session.user.id)
    });

    const headersList = await headers();
    const pathname = headersList.get("x-current-url")?.toString() || '';

    if (!candidate?.resume) {
        currentStep = 0;
        if (pathname != steps.resume) redirect(steps.resume)
    } else if (!candidate.salaryExpectation) {
        if (pathname != steps.validation && pathname != steps.final)
            redirect(steps.validation)
        if (pathname == steps.validation) currentStep = 1;
        else if (pathname == steps.final) currentStep = 2;
    } else redirect('/')

    return (
        <div>
            <ProgressBar currentStep={currentStep} />
            {children}
        </div>
    );
}
