"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Pricing page is a Client Component — Navbar is rendered server-side from layout
export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      if (res.status === 401) {
        toast.error("Please sign in to subscribe.");
        router.push("/sign-in");
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Stripe error");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong with the payment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 px-4 bg-[hsl(240,10%,3.9%)]">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 gradient-text">Simple, transparent pricing</h1>
        <p className="text-gray-400 text-lg">Choose the plan that fits your needs. No hidden fees.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pb-20">
        {/* Free Plan */}
        <Card className="glass border-white/5 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">Free Tier</CardTitle>
            <CardDescription>Try it out for free</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-3xl font-bold mb-6">$0 <span className="text-sm text-gray-400 font-normal">/ month</span></div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <Check className="w-4 h-4 text-violet-400" /> 2 recordings per month
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <Check className="w-4 h-4 text-violet-400" /> Basic transcription
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400 opacity-50">
                No storage in history
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-white/10" onClick={() => router.push("/")}>
              Start for Free
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="glass border-violet-500/30 relative flex flex-col glow-purple">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 px-3 py-1 rounded-full text-xs font-bold uppercase text-white tracking-wider">
            Popular
          </div>
          <CardHeader>
            <CardTitle className="text-xl">Pro Access</CardTitle>
            <CardDescription>Unlimited possibilities</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-3xl font-bold mb-6">$9.99 <span className="text-sm text-gray-400 font-normal">/ month</span></div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <Check className="w-4 h-4 text-violet-400" /> Unlimited recordings
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <Check className="w-4 h-4 text-violet-400" /> Priority OpenAI Whisper
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <Check className="w-4 h-4 text-violet-400" /> ChatGPT transcript analysis
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <Check className="w-4 h-4 text-violet-400" /> Save all history
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-violet-600 hover:bg-violet-700 font-bold" onClick={handleSubscribe} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe & Access"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
