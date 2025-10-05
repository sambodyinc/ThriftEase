"use client";

import { CartProvider } from "@/hooks/use-cart";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  );
}
