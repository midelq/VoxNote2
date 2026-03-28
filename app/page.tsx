import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  let userId = null;
  try {
    const authData = await auth();
    userId = authData.userId;
  } catch (e) {
    // Clerk not configured
  }

  return (
    <main className="min-h-screen bg-[hsl(240,10%,3.9%)] overflow-x-hidden">
      <HeroSection initialIsSignedIn={!!userId} />
      <FeaturesSection />
      <HowItWorksSection />
    </main>
  );
}
