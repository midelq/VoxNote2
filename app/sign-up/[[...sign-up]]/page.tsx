import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[hsl(240,10%,3.9%)]">
      <SignUp />
    </main>
  );
}
