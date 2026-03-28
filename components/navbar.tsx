import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

export async function Navbar() {
  const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_');
  let userId = null;

  if (isClerkConfigured) {
    try {
      const authData = await auth();
      userId = authData.userId;
    } catch (e) {
      console.log("Navbar: Clerk not ready");
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/10 h-16">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center group-hover:bg-violet-500 transition-colors">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            VoxNote
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Pricing
          </Link>
          {userId ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  Dashboard
                </Button>
              </Link>
              <UserButton />
            </>
          ) : (
            <div className="flex items-center gap-2">
              {isClerkConfigured ? (
                <>
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="text-gray-400 hover:text-white">
                      Sign In
                    </Button>
                  </SignInButton>
                  <Link href="/sign-up">
                    <Button className="bg-violet-600 hover:bg-violet-500 text-white border-0">
                      Get Started
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/dashboard">
                  <Button className="bg-violet-600 hover:bg-violet-500 text-white border-0">
                    Preview Dashboard
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
