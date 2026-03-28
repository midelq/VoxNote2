"use client";

import { VoiceRecorder } from "@/components/voice-recorder";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection({ initialIsSignedIn, limitReached }: { initialIsSignedIn?: boolean; limitReached?: boolean }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 overflow-hidden">
      {/* Background glow effects with animations */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none animate-float" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-blue-600/8 rounded-full blur-[80px] pointer-events-none animate-float-slow" />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="mb-6 bg-violet-600/20 text-violet-300 border-violet-500/30 hover:bg-violet-600/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Powered by OpenAI Whisper & GPT-4
          </Badge>
        </motion.div>

        <motion.h1 
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-12 leading-tight text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Your Voice,{" "}
          <span className="gradient-text">Transcribed</span>
          <br />
          Instantly
        </motion.h1>

        {/* Voice Recorder Widget with staggered animation */}
        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <VoiceRecorder initialIsSignedIn={initialIsSignedIn} limitReached={limitReached} />
        </motion.div>
      </div>
    </section>
  );
}
