import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VoiceRecorder } from "@/components/voice-recorder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mic, History, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default async function DashboardPage() {
  // Auth check — redirect if not logged in
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // Get user + recordings from DB
  let user = null;
  try {
    user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { recordings: { orderBy: { createdAt: "desc" } } },
    });
  } catch (e) {
    console.error("DB error:", e);
  }

  // If user not in DB yet (webhook hasn't fired) — create them
  if (!user) {
    try {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: userId + "@placeholder.com",
          subscriptionStatus: "free",
        },
        include: { recordings: true },
      });
    } catch (e) {
      console.error("Could not create user:", e);
    }
  }

  const isPro = user?.subscriptionStatus === "pro";
  const recordings = user?.recordings ?? [];

  // Count this month's recordings for free users
  let monthlyCount = 0;
  if (!isPro) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    monthlyCount = recordings.filter(
      (r) => new Date(r.createdAt) >= startOfMonth
    ).length;
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 bg-[hsl(240,10%,3.9%)]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Subscription Card - Enhanced Visibility */}
          <Card className="glass border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.1)] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 blur-3xl -z-10" />
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-black flex items-center gap-2 text-white uppercase tracking-tighter">
                <Mic className="w-5 h-5 text-violet-400" /> Your Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-sm font-bold text-white uppercase tracking-widest">Active Plan</span>
                {isPro ? (
                  <Badge className="bg-violet-600 text-white border-none px-4 py-1 text-xs font-black shadow-[0_0_15px_rgba(139,92,246,0.5)] animate-pulse-slow">
                    PRO MEMBER
                  </Badge>
                ) : (
                  <Badge className="bg-gray-600/20 text-gray-400 border-gray-500/20 px-4 py-1">
                    Free Plan
                  </Badge>
                )}
              </div>
              
              {!isPro && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-400 flex justify-between items-center font-medium">
                    <span>Monthly Usage:</span>
                    <span className={monthlyCount >= 2 ? "text-red-400 font-black" : "text-violet-300"}>
                      {monthlyCount} / 2 recordings
                    </span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${monthlyCount >= 2 ? 'bg-red-500' : 'bg-violet-500'}`}
                      style={{ width: `${Math.min((monthlyCount / 2) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {!isPro && (
                <Link href="/pricing" className="block">
                  <Button className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black py-6 shadow-lg shadow-violet-600/20 transition-all hover:scale-[1.02]">
                    Upgrade to Pro Access
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
              <History className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Recording History</h2>
              <p className="text-gray-400 text-sm">Access all your previous notes</p>
            </div>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {recordings.length === 0 ? (
              <Card className="glass border-dashed border-white/10 p-12 text-center text-gray-500">
                <p>No recordings yet. Start your first one!</p>
              </Card>
            ) : (
              recordings.map((recording: any) => (
                <Card key={recording.id} className="glass border-white/5 hover:border-violet-500/20 transition-all group">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(recording.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200 line-clamp-3 leading-relaxed mb-4 italic">
                      &ldquo;{recording.transcript}&rdquo;
                    </p>
                    {recording.aiResponse && (
                      <div className="bg-violet-600/5 rounded-lg p-3 border border-violet-500/10">
                        <span className="text-[10px] uppercase font-bold text-violet-400 mb-1 block">AI Analysis</span>
                        <p className="text-xs text-gray-400">{recording.aiResponse}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
