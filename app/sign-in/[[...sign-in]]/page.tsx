import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[hsl(240,10%,3.9%)]">
      <SignIn />
    </main>
  );
}
