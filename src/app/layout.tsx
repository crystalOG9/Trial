import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BackgroundVisuals } from "@/components/BackgroundVisuals";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AUTOMATE | AI Business Automation",
  description:
    "We discover repetitive business workflows and build AI-powered automation around the way your company actually works.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-brand-500/30 selection:text-brand-50">
        <BackgroundVisuals />
        {children}
      </body>
    </html>
  );
}
