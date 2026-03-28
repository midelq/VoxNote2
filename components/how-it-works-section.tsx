import { Mic, UserCheck, CreditCard, LayoutDashboard } from "lucide-react";

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
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="text-gray-400 text-lg">From voice to text in 4 simple steps</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-white/10 to-transparent z-10" />
              )}
              <div className={`glass rounded-2xl p-6 border ${step.border} hover:-translate-y-1 transition-all duration-300`}>
                <div className="text-4xl font-black text-white/5 mb-3">{step.number}</div>
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4`}>
                  <step.icon className={`w-5 h-5 ${step.color}`} />
                </div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
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
