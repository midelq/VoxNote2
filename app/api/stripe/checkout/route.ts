import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 1. Check if user already has a subscription
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (dbUser?.stripeCustomerId && dbUser.subscriptionStatus === "active") {
        return NextResponse.json({ url: "/dashboard" });
    }

    // 2. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID, // Ensure this is set in .env.local
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: user.emailAddresses[0].emailAddress,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        clerkUserId: userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[STRIPE_ERROR]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
