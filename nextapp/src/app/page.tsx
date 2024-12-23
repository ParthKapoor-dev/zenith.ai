import { verifySession } from "@/lib/session";
import Link from "next/link";

export default async function Home() {

  const session = await verifySession();
  console.log("Session at home Page ", session);

  return (
    <div>

      This is the Home Page , Go to Login Page :-

      <Link href={"/auth/login"}>
        Login page
      </Link>

    </div>
  )
}