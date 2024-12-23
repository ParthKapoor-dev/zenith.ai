"use server"

import { deleteSession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export default async function handleLogout() {

    try {
        await deleteSession();
        // NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")

    } catch (error) {
        console.error("Authentication error:", error);
        throw error;
    }
}