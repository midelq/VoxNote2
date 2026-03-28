import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Transcribe with Whisper
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
    });

    const text = transcription.text;

    // 2. If user is logged in, save to DB
    if (userId) {
        // Find or create user in our DB (webhook usually does this, but we ensure here too)
        const dbUser = await prisma.user.upsert({
            where: { clerkId: userId },
            update: {},
            create: {
                clerkId: userId,
                email: "user-" + userId + "@example.com", // This should ideally come from Clerk
            }
        });

        await prisma.recording.create({
            data: {
                userId: dbUser.id,
                transcript: text,
            }
        });
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("[TRANSCRIBE_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
