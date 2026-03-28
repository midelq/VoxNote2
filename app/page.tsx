import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  let userId = null;
  let limitReached = false;

  try {
    const authData = await auth();
    userId = authData.userId;
  } catch (e) {
    // Clerk not configured
  }

  // Check monthly limit for logged-in users
  if (userId) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (dbUser && dbUser.subscriptionStatus !== "pro") {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyCount = await prisma.recording.count({
          where: { userId: dbUser.id, createdAt: { gte: startOfMonth } },
        });

        limitReached = monthlyCount >= 2;
      }
    } catch (e) {
      // DB not ready
    }
  }

  return (
    <main className="min-h-screen bg-[hsl(240,10%,3.9%)] overflow-x-hidden">
      <HeroSection initialIsSignedIn={!!userId} limitReached={limitReached} />
      <FeaturesSection />
      <HowItWorksSection />
    </main>
  );
}
