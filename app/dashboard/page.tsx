import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VoiceRecorder } from "@/components/voice-recorder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, History, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
  let userId = null;
  try {
     const authData = await auth();
     userId = authData.userId;
  } catch (e) {
     console.log("Auth not configured, using preview mode");
  }

  /* 
  if (!userId) {
    redirect("/sign-in");
  }
  */

  // 1. Get user status from DB
  let user = null;
  try {
     user = await prisma.user.findUnique({
        where: { clerkId: userId || "preview-user" },
        include: { recordings: { orderBy: { createdAt: "desc" } } },
     });
  } catch (e) {
     console.log("DB not ready, showing mock data for preview");
  }

  // 2. Mock user for design preview
  if (!user) {
    user = {
      subscriptionStatus: "active",
      recordings: [
        { id: "1", transcript: "Це тестовий запис для огляду дизайну. VoxNote виглядає чудово!", createdAt: new Date(), aiResponse: "AI Аналіз: Текст звучить позитивно!" },
        { id: "2", transcript: "Штучний інтелект Whisper працює дуже швидко.", createdAt: new Date(Date.now() - 3600000), aiResponse: null }
      ]
    } as any;
  }

  /*
  if (!user || user.subscriptionStatus !== "active") {
    redirect("/pricing");
  }
  */

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 bg-[hsl(240,10%,3.9%)]">

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recorder */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center">
              <Plus className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">New Recording</h1>
              <p className="text-gray-400 text-sm">Transcribe your voice now</p>
            </div>
          </div>
          
          <VoiceRecorder initialIsSignedIn={!!userId} />
          
          <Card className="glass border-white/5">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Mic className="w-4 h-4 text-violet-400" /> Your Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Active Plan</span>
                <Badge className="bg-green-600/20 text-green-400 border-green-500/20">Pro Member</Badge>
              </div>
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
            {user.recordings.length === 0 ? (
              <Card className="glass border-dashed border-white/10 p-12 text-center text-gray-500">
                <p>No recordings yet. Start your first one!</p>
              </Card>
            ) : (
              user.recordings.map((recording: any) => (
                <Card key={recording.id} className="glass border-white/5 hover:border-violet-500/20 transition-all group">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(recording.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200 line-clamp-3 leading-relaxed mb-4 italic">
                      "{recording.transcript}"
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
