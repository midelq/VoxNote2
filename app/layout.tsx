import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
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
  return (
    <ClerkProvider 
      afterSignOutUrl="/"
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#8b5cf6",
        },
      }}
    >
      <html lang="en" className="dark">
        <body className={inter.className}>
          <Navbar />
          {children}
          <Toaster position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}
