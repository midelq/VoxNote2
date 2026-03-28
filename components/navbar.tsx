import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

export async function Navbar() {
  const { userId } = await auth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10 h-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95 duration-200">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center group-hover:bg-violet-500 shadow-lg shadow-violet-600/20 transition-all duration-300">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-gray-500">
            VoxNote
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <Link 
            href="/pricing" 
            className="text-lg font-bold text-gray-200 hover:text-violet-400 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            Pricing
          </Link>
          
          {userId ? (
            <>
              <Link 
                href="/dashboard"
                className="text-lg font-bold text-gray-200 hover:text-violet-400 transition-all duration-300 hover:scale-110 active:scale-95"
              >
                Dashboard
              </Link>
              <div className="hover:scale-110 transition-transform duration-200">
                <UserButton />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <SignInButton mode="modal">
                <button className="text-lg font-bold text-gray-200 hover:text-violet-400 transition-all duration-300 hover:scale-110 active:scale-95 px-4 py-2">
                  Sign In
                </button>
              </SignInButton>
              <Link href="/sign-up">
                <Button className="bg-violet-600 hover:bg-violet-500 text-white border-0 h-11 px-6 text-base font-black shadow-lg shadow-violet-600/20 transition-all duration-300 hover:scale-110 active:scale-95">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
