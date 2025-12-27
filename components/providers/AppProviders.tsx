"use client";
import { ThemeProvider } from "next-themes";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FlowValidationContextProvider from "../contexts/FlowValidationContext";

function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <FlowValidationContextProvider>
          {children}
        </FlowValidationContextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default AppProviders;
