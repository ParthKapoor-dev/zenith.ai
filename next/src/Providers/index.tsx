
import { Toaster } from "@/components/ui/toaster"
import { ReactNode } from "react"
import { ThemeProvider } from "./ThemeProvider"

export default function Providers({ children }: {
    children: ReactNode
}) {

    return (
        <>
            <ThemeProvider attribute="class" defaultTheme="light" >
                {children}
                <Toaster />
            </ThemeProvider>
        </>

    )
}