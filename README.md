# VoxNote 🎙️

Voice-to-Text Micro MVP built with Next.js 14, Clerk, OpenAI Whisper/GPT-4, Prisma, Supabase, and Stripe.

## Features
- **1 Free Recording**: Users can record and transcribe once without an account.
- **Pay-to-Unlock**: Users must sign in (Clerk) and subscribe (Stripe) for unlimited access.
- **AI Transcription**: High-accuracy speech-to-text using OpenAI Whisper.
- **AI Analysis**: Get ChatGPT-powered summaries and insights from your recordings.
- **Recording History**: All transcriptions are saved to Supabase (via Prisma) for pro users.

## Setup Instructions

### 1. Environment Variables
Copy the content of `.env.local` and fill in your real API keys from:
- [Clerk Dashboard](https://dashboard.clerk.com/)
- [OpenAI Dashboard](https://platform.openai.com/)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Stripe Dashboard](https://dashboard.stripe.com/)

### 2. Database Setup
```bash
npx prisma db push
```

### 3. Stripe Webhook
If testing locally, use the Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Copy the webhook secret to `STRIPE_WEBHOOK_SECRET` in `.env.local`.

### 4. Clerk Webhook
Set up a webhook in the Clerk Dashboard pointing to `https://your-domain.com/api/webhooks/clerk` with the `user.created` and `user.updated` events.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Auth**: Clerk
- **AI**: OpenAI (Whisper-1, GPT-4)
- **Database**: Supabase + Prisma ORM
- **Payments**: Stripe Subscriptions
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
