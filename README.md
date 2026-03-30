# VoxNote — Premium AI Voice Notes SaaS

VoxNote is a sophisticated web application that transforms your voice recordings into structured text and intelligent summaries using state-of-the-art AI models.

**🔗 [Live Demo](https://vox-note-six.vercel.app/)**

![VoxNote Hero Preview](https://antigravity-artifacts.s3.amazonaws.com/voxnote_preview.png) *(Placeholder for your future screenshot)*

## Full Tech Stack

Our application is built using the most modern tools to ensure maximum speed, stability, and scalability:

### **Frontend & UI**
- **[Next.js 16 (App Router)](https://nextjs.org/)**: The latest version of the framework for ultra-fast rendering (React 19).
- **[Tailwind CSS 4](https://tailwindcss.com/)**: Next-gen styling for a flexible, responsive design.
- **[Framer Motion](https://www.framer.com/motion/)**: Smooth animations and micro-interactions for a premium UX.
- **[Shadcn UI](https://ui.shadcn.com/)**: A collection of high-quality UI components.
- **[Lucide React](https://lucide.dev/)**: Modern icon library.

### **Backend & Infrastructure**
- **[Clerk Auth](https://clerk.com/)**: Complete user authentication system with a custom dark theme and violet accents.
- **[Prisma ORM](https://www.prisma.io/)**: Robust tool for database communication.
- **[PostgreSQL (Supabase)](https://supabase.com/)**: Cloud database for storing transcriptions and user data.
- **[Svix](https://www.svix.com/)**: Webhook processing (Clerk, Stripe) for real-time data synchronization.

### **Artificial Intelligence (AI)**
- **[OpenAI Whisper](https://openai.com/research/whisper)**: Leading model for speech-to-text transcription.
- **[OpenAI GPT-4o-mini](https://openai.com/index/gpt-4o-mini/)**: Intelligent text analysis, summarization, and key insight extraction.
- **[Promptfoo](https://www.promptfoo.dev/)**: Framework for testing and validating AI prompt quality.

### **Payments & Monetization**
- **[Stripe Checkout](https://stripe.com/checkout)**: Secure subscription and payment processing.

---

## Key Features

- **AI Transcription**: Instant voice-to-text conversion with high accuracy.
- **Quick Insights**: Automatically generate summaries and action items after every recording.
- **Premium UI**: Modern glassmorphism design with dark mode and violet gradients.
- **Subscription Model**: Free plan (2 recordings/mo) and Pro plan for unlimited access.
- **Prompt Testing**: Every AI instruction is verified through Promptfoo for consistent results.

---

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone [your-repo-url]
   cd VoxNote2
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file and add your keys (OpenAI, Clerk, Stripe, Database).

4. **Initialize the Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```

---

## AI Evaluation (Promptfoo)

We prioritize the quality of our AI analysis. We use **Promptfoo** to evaluate and refine our prompts.

Run the prompt evaluation:
```bash
npx promptfoo eval --env-file .env.local
```
View evaluation results in the UI:
```bash
npx promptfoo view
```
