import { Metadata } from "next";
import { headers } from "next/headers";
import ProgressBar from "../onboarding/ProgressBar";

export const metadata: Metadata = {};

const steps = {
    resume: '/update/resume',
    validation: '/update/validation',
    final: '/update/final',
};

export default async function UpdateAccLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {

    let currentStep = 0;

    const headersList = await headers();
    const pathname = headersList.get("x-current-url")?.toString() || '';

    if (pathname == steps.resume) currentStep = 0;
    else if (pathname == steps.validation) currentStep = 1;
    else if (pathname == steps.final) currentStep = 2;

    else return (
        <div className="absolute inset-0 h-screen w-screen flex justify-center items-center text-2xl font-bold">
            Page Not Found
        </div>
    )

    return (
        <div>
            <ProgressBar currentStep={currentStep} />
            {children}
        </div>
    );
}
