"use client";

import { VoiceRecorder } from "@/components/voice-recorder";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function HeroSection({ initialIsSignedIn }: { initialIsSignedIn?: boolean }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-blue-600/8 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <Badge className="mb-6 bg-violet-600/20 text-violet-300 border-violet-500/30 hover:bg-violet-600/30">
          <Sparkles className="w-3 h-3 mr-1" />
          Powered by OpenAI Whisper & GPT-4
        </Badge>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
          Your Voice,{" "}
          <span className="gradient-text">Transcribed</span>
          <br />
          Instantly
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 mb-4 max-w-2xl mx-auto leading-relaxed">
          Speak into your microphone and let AI convert your voice to text in seconds.
          First recording is <span className="text-violet-400 font-semibold">completely free</span>.
        </p>

        <p className="text-sm text-gray-500 mb-12">No credit card required to start</p>

        {/* Voice Recorder Widget */}
        <div className="max-w-2xl mx-auto">
          <VoiceRecorder initialIsSignedIn={initialIsSignedIn} />
        </div>
      </div>
    </section>
  );
}
