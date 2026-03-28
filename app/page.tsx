import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { VoiceRecorder } from "@/components/voice-recorder";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_');
  let userId = null;

  if (isClerkConfigured) {
    try {
      const authData = await auth();
      userId = authData.userId;
    } catch (e) {
      // Clerk not configured
    }
  }

  return (
    <main className="min-h-screen bg-[hsl(240,10%,3.9%)] overflow-x-hidden">
      <Navbar />
      <HeroSection />
      
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <VoiceRecorder initialIsSignedIn={!!userId} />
        </div>
      </section>

      <FeaturesSection />
      <HowItWorksSection />
    </main>
  );
}
