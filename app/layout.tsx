import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
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
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={inter.className}>
          {children}
          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
