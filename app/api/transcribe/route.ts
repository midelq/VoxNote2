import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const FREE_MONTHLY_LIMIT = 2;

export async function POST(req: NextRequest) {
  console.log("🚀 [TRANSCRIBE] Incoming request...");
  try {
    const { userId } = await auth();
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // If user is logged in — check limits
    if (userId) {
      // Find or create user in DB
      const dbUser = await prisma.user.upsert({
        where: { clerkId: userId },
        update: {},
        create: {
          clerkId: userId,
          email: "user-" + userId + "@placeholder.com",
        },
      });

      const isPro = dbUser.subscriptionStatus === "pro";

      // Check monthly limit for free users
      if (!isPro) {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyCount = await prisma.recording.count({
          where: {
            userId: dbUser.id,
            createdAt: { gte: startOfMonth },
          },
        });

        if (monthlyCount >= FREE_MONTHLY_LIMIT) {
          return NextResponse.json(
            {
              error: "Monthly limit reached",
              message: `Free plan allows ${FREE_MONTHLY_LIMIT} recordings per month. Upgrade to Pro for unlimited recordings.`,
              limitReached: true,
            },
            { status: 403 }
          );
        }
      }

      // Transcribe with Whisper
      const transcription = await openai.audio.transcriptions.create({
        file,
        model: "whisper-1",
      });

      console.log("✅ [WHISPER] Transcription received from OpenAI API");

      const text = transcription.text;

      // Save recording to DB
      await prisma.recording.create({
        data: {
          userId: dbUser.id,
          transcript: text,
        },
      });

      return NextResponse.json({ text });
    }

    // Guest user — just transcribe, no save (limit handled client-side)
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
    });

    console.log("✅ [WHISPER GUEST] Transcription received from OpenAI API");

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error("[TRANSCRIBE_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
