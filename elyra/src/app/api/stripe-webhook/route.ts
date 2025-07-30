"use server";

import { stripe } from "@/lib/stripe";
import { updateSubscription } from "@/action/stripe";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

const STRIPE_SUBSCRIPTION_EVENTS = new Set([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: NextRequest) {
  console.log("Received Stripe webhook event");
  const body = await req.text();
  const sig  = headers().get("Stripe-Signature");

  try {
    const stripeEvent = await getStripeEvent(body, sig);

    if (!STRIPE_SUBSCRIPTION_EVENTS.has(stripeEvent.type)) {
      console.log("Ignored irrelevant event:", stripeEvent.type);
      return NextResponse.json({ received: true });
    }

    const subscription = stripeEvent.data.object as Stripe.Subscription;
    await updateSubscription(subscription);
    console.log("Processed subscription event:", stripeEvent.type);

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return new NextResponse("Webhook error", { status: 500 });
  }
}

const getStripeEvent = async (
  body: string,
  sig: string | null
): Promise<Stripe.Event> => {
  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Missing signature or webhook secret");
  }
  return stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
};
