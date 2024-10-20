import { Toaster } from "@/components/ui/toaster";
import { ReactQueryProvider, ThemeProvider } from "@/lib/providers";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { extractRouterConfig } from "uploadthing/server";
import { fileRouter } from "./api/uploadthing/core";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Spotlight",
    default: "Spotlight"
  },
  description: "Social Media App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body >
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ReactQueryProvider>
              {children}
              <Toaster />
            </ReactQueryProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
