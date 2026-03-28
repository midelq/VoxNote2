import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VoxNote — Voice to Text AI",
  description: "Transform your voice into text instantly with AI. Free first recording, powered by OpenAI Whisper.",
  keywords: ["voice to text", "speech recognition", "AI transcription", "OpenAI Whisper"],
  openGraph: {
    title: "VoxNote — Voice to Text AI",
    description: "Transform your voice into text instantly with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_');

  const content = (
    <>
      <Navbar />
      {children}
      <Toaster richColors position="top-right" />
    </>
  );

  if (!isClerkConfigured) {
    return (
      <html lang="en" className="dark">
        <body className={inter.className}>
          {content}
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" className="dark">
        <body className={inter.className}>
          {content}
        </body>
      </html>
    </ClerkProvider>
  );
}
