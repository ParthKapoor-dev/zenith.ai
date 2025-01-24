import { verifySession } from "@/lib/session";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export default async function RecruiterLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await verifySession();
    if (session.user?.role !== 'recruiter') redirect('/')

    return (
        <>
            {children}
        </>
    );
}
