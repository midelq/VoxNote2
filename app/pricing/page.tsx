"use client";

import { useState } from "react";
import { Check, Loader2, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
    <main className="min-h-screen pt-32 px-4 bg-black relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-6xl font-black mb-6 tracking-tighter text-white">
            Simple, <span className="gradient-text">transparent</span> pricing
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose the plan that fits your needs. No hidden fees. 
            Unlock the full power of AI-driven voice transcription.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto pb-20 relative z-10">
        {/* Free Plan */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass border-white/5 flex flex-col h-full hover:border-white/20 transition-colors group">
            <CardHeader className="pb-8">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-gray-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Free Tier</CardTitle>
              <CardDescription className="text-gray-400">Try it out for free</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-white">$0</span>
                <span className="text-gray-500 font-medium">/month</span>
              </div>
              <ul className="space-y-4">
                {[
                  "2 recordings per month",
                  "Basic transcription",
                  "Standard AI processing",
                  "No history storage",
                ].map((feature, i) => (
                  <li key={i} className={`flex items-center gap-3 text-sm ${i === 3 ? "text-gray-600" : "text-gray-300"}`}>
                    <Check className={`w-5 h-5 ${i === 3 ? "text-gray-700" : "text-violet-400"}`} />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-8">
              <Button 
                variant="outline" 
                className="w-full border-white/10 hover:bg-white/5 h-12 text-base font-semibold" 
                onClick={() => router.push("/")}
              >
                Start for Free
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Pro Plan */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          <Card className="glass border-violet-500/30 relative flex flex-col h-full overflow-hidden bg-violet-950/5">
            <div className="absolute top-0 right-0 bg-violet-600 text-white px-4 py-1 text-xs font-black uppercase tracking-widest rounded-bl-xl">
              Popular
            </div>
            <CardHeader className="pb-8">
              <div className="w-12 h-12 rounded-xl bg-violet-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-violet-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Pro Access</CardTitle>
              <CardDescription className="text-violet-300/60">Unlimited possibilities</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-white">$9.99</span>
                <span className="text-violet-300/50 font-medium">/month</span>
              </div>
              <ul className="space-y-4">
                {[
                  "Unlimited recordings",
                  "Priority OpenAI Whisper",
                  "ChatGPT transcript analysis",
                  "Private history dashboard",
                  "Export to multiple formats",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                    <Check className="w-5 h-5 text-violet-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-8 bg-white/5">
              <Button 
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black h-12 text-base shadow-lg shadow-violet-600/20" 
                onClick={handleSubscribe} 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <div className="flex items-center gap-2">
                    Subscribe & Access <Zap className="w-4 h-4 fill-current" />
                  </div>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
