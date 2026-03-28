"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

export function Navbar() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center group-hover:bg-violet-500 transition-colors">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">VoxNote</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/pricing">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                Pricing
              </Button>
            </Link>
            
            {!isLoaded ? (
              <div className="w-20 h-8 rounded animate-pulse bg-white/10" />
            ) : isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white">
                    Dashboard
                  </Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm" className="hidden sm:flex text-gray-300 hover:text-white">
                    Log In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white">
                    Get Started
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
