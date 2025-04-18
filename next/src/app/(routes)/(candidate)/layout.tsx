import { verifySession } from "@/lib/session";
import { Metadata } from "next";
import { redirect } from "next/navigation";


export default async function CandidateLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await verifySession();
    if (session?.user?.role !== 'candidate') redirect('/')

    return (
        <>
            {children}
        </>
    );
}
