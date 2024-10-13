import { ReactQueryProvider, ThemeProvider } from "@/lib/providers";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
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
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ReactQueryProvider>
              {children}
            </ReactQueryProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
