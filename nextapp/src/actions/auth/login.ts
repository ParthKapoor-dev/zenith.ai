"use server";

import { redirect } from "next/navigation";
import { UserRole } from "@/types/user";
import axios from "axios"
import jwt from "jsonwebtoken"
import { db } from "@/db";
import { eq } from "drizzle-orm";
import schema from "@/db/schema";
import { createSession } from "@/lib/session";

export default async function handleGoogleLogin(role: UserRole, code?: string) {
    try {
        if (!code) {
            // Step 1: Redirect to Google OAuth
            await googleOauth(role);
        } else {
            // Step 2: Exchange code for tokens
            const response = await axios.post("https://oauth2.googleapis.com/token", null, {
                params: {
                    client_id: process.env.GOOGLE_CLIENT_ID,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    code: code,
                    grant_type: "authorization_code",
                    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback?role=${role}`,
                },
            });

            // Step 3: Decode ID token to get user info
            const userInfo = jwt
                .decode(response.data?.id_token) as { email: string; name: string; picture: string };

            console.log(response.data)
            console.log(userInfo);
            // Step 4: Check if the user exists in the database
            await db.insert(schema.Users).values({
                name: userInfo.name,
                email: userInfo.email,
                role,
                image : userInfo.picture
            }).onDuplicateKeyUpdate({
                set: {
                    name: userInfo.name
                }
            })

            const user = await db.query.Users.findFirst({
                where: eq(schema.Users.email, userInfo.email)
            });
            if (!user) {
                throw new Error("User creation failed.");
            }

            // Step 6: Create a session
            await createSession(user, response.data.id_token);
        }
    } catch (error) {
        console.error("Authentication error:", error);
        throw error;
    }
}


async function googleOauth(userRole: string) {
    const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback?role=${userRole}`;

    const queryParams = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
    });

    redirect(`${baseUrl}?${queryParams.toString()}`);
}
