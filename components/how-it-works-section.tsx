"use client";

import { Mic, UserCheck, CreditCard, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: Mic,
    title: "Record for Free",
    description: "Press the mic button and speak. Your first transcription is completely free — no account needed.",
    color: "text-violet-400",
    border: "border-violet-500/30",
  },
  {
    number: "02",
    icon: UserCheck,
    title: "Create Your Account",
    description: "Sign up with email or Google via Clerk. Fast, secure, and takes under 30 seconds.",
    color: "text-blue-400",
    border: "border-blue-500/30",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Subscribe",
    description: "Choose a plan and pay securely with Stripe. Cancel anytime, no hidden fees.",
    color: "text-green-400",
    border: "border-green-500/30",
  },
  {
    number: "04",
    icon: LayoutDashboard,
    title: "Access Dashboard",
    description: "Unlimited recordings, AI chat, and full history saved to your personal dashboard.",
    color: "text-yellow-400",
    border: "border-yellow-500/30",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="text-gray-400 text-lg">From voice to text in 4 simple steps</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {steps.map((step, index) => (
            <motion.div 
              key={step.number} 
              className="relative h-full"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className={`glass rounded-2xl p-6 border ${step.border} hover:-translate-y-1 transition-all duration-300 h-full flex flex-col relative overflow-hidden group`}>
                {/* Step Number Background */}
                <div className="absolute -top-2 -right-2 text-6xl font-black text-white/5 pointer-events-none group-hover:text-white/10 transition-colors">
                  {step.number}
                </div>
                
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 shrink-0 group-hover:scale-110 transition-transform`}>
                  <step.icon className={`w-5 h-5 ${step.color}`} />
                </div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-grow">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-20 pb-10 border-t border-white/5 pt-10">
          <p className="text-gray-500 text-sm">
            © 2025 VoxNote. Built with OpenAI, Clerk, Stripe & Next.js
          </p>
        </div>
      </div>
    </section>
  );
}
