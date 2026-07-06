"use client";

import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "./auth-provider";
import { ToastProvider } from "./toast-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <TooltipProvider>
          {children}
          <ToastProvider />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
