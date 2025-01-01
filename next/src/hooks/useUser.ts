import User from "@/types/user";
import Cookies from "js-cookie"

export function useUser() {

    let session = Cookies.get("user");

    if (!session) return null

    return JSON.parse(session) as User;

}
