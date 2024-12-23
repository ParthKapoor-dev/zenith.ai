
import { Toaster } from "@/components/ui/toaster"
import { ReactNode } from "react"

export default function Providers({ children }: {
    children: ReactNode
}) {

    return (
        <>
            {children}
            <Toaster />
        </>
    )
}