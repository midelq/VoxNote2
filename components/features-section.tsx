"use client";

import { Mic, Zap, Shield, Database, MessageSquare, Globe } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Mic,
    title: "Voice Recording",
    description: "Crystal-clear audio capture directly from your browser. No app download needed.",
    color: "text-violet-400",
    bg: "bg-violet-600/10",
  },
  {
    icon: Zap,
    title: "Instant Transcription",
    description: "OpenAI Whisper converts your speech to text in under 3 seconds with 99% accuracy.",
    color: "text-yellow-400",
    bg: "bg-yellow-600/10",
  },
  {
    icon: MessageSquare,
    title: "AI Chat View",
    description: "Send your transcript to GPT-4 for summaries, analysis, or follow-up questions.",
    color: "text-blue-400",
    bg: "bg-blue-600/10",
  },
  {
    icon: Database,
    title: "Recording History",
    description: "All your transcriptions saved securely in the cloud. Access them anytime.",
    color: "text-green-400",
    bg: "bg-green-600/10",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Enterprise-grade auth with Clerk. Your data is encrypted and never shared.",
    color: "text-red-400",
    bg: "bg-red-600/10",
  },
  {
    icon: Globe,
    title: "100+ Languages",
    description: "Whisper supports over 100 languages and dialects out of the box.",
    color: "text-cyan-400",
    bg: "bg-cyan-600/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Everything you need to{" "}
            <span className="gradient-text">capture ideas</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A complete voice-to-text platform powered by the latest AI technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass rounded-2xl p-6 hover:border-violet-500/30 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
