import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Job Description Generator - Create Professional JDs in Seconds",
  description: "Generate professional, bias-free job descriptions with AI. Includes bias detection, salary suggestions, and optimized formatting for job boards.",
  keywords: ["job description generator", "AI job description", "HR tools", "hiring", "recruitment", "job posting"],
  openGraph: {
    title: "AI Job Description Generator",
    description: "Generate professional, bias-free job descriptions with AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Job Description Generator",
    description: "Generate professional, bias-free job descriptions with AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
