import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Analytics } from "@vercel/analytics/react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <NuqsAdapter>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
          <Analytics />
          <Toaster />
        </ThemeProvider>
      </NuqsAdapter>
    </>
  );
}
