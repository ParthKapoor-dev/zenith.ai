
import User from "@/types/user";
import { redirect } from "next/navigation";
import Cookies from "js-cookie"

export function useUser() {

    let session = Cookies.get("user");

    if (!session) return null

    return JSON.parse(session) as User;

}



// import useSwr from "swr"


// const fetcher = (url: string) => fetch(url).then((res) => res.json());

// export function useUser() {

//     const { data, error, isLoading } = useSwr(`/api/user`, fetcher)

//     console.log("SWR Component " , data?.user?.email)

//     return {
//         user: data,
//         isLoading,
//         isError: error
//     }
// }
