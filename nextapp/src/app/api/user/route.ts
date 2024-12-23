import { verifySession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await verifySession();
    console.log("GET Session : " , session.user);

    return NextResponse.json(session)
}