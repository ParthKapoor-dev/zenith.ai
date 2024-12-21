import handleGoogleLogin from "@/actions/auth/login";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const role = searchParams.get("role");

    console.log("Callback Page");

    if (!role || (role !== "candidate" && role !== "recruiter")) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    try {
        await handleGoogleLogin(role, code as string);
        return NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL!);
        
    } catch (error) {
        console.error(error);
        return NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL!);
    }
}
