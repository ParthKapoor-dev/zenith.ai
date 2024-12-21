import Link from "next/link";

export default function Home(){
  

  return(
    <div>

      This is the Home Page , Go to Login Page :-

      <Link href={"/auth/login"}>
        Login page
      </Link>
    </div>
  )
}