import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function handleLogout() {

    try {

        await deleteSession();
        redirect("/")

    } catch (error) {
        console.error("Authentication error:", error);
        throw error;
    }
}