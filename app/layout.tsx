import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import "./globals.css";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";

// --------- FONTS ---------
const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

// --------- METADATA ---------
export const metadata: Metadata = {
  title: "Editor Setup",
  description: "Find your next optimal editor setup",
};

// --------- LAYOUT ---------
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${fontDisplay.variable} ${fontSans.variable} bg-background font-sans antialiased`}
      >
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
            <Header />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
