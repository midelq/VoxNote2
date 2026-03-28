import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.clerkUserId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    await prisma.user.upsert({
      where: {
        clerkId: session.metadata.clerkUserId,
      },
      update: {
        stripeCustomerId: session.customer as string,
        subscriptionStatus: "pro",
      },
      create: {
        clerkId: session.metadata.clerkUserId,
        email: session.customer_details?.email || "",
        stripeCustomerId: session.customer as string,
        subscriptionStatus: "pro",
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await prisma.user.update({
      where: {
        stripeCustomerId: subscription.customer as string,
      },
      data: {
        subscriptionStatus: "pro",
      },
    });
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    await prisma.user.update({
      where: {
        stripeCustomerId: subscription.customer as string,
      },
      data: {
        subscriptionStatus: "free",
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
