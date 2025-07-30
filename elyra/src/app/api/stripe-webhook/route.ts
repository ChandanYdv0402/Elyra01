"use server";

import { changeAttendanceType } from "@/action/attendance";
import { updateSubscription }  from "@/action/stripe";
import { stripe }              from "@/lib/stripe";
import { headers }             from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe                  from "stripe";

// Only these subscription-related events
const STRIPE_SUBSCRIPTION_EVENTS = new Set([
  "invoice.created",
  "invoice.finalized",
  "invoice.paid",
  "checkout.session.completed",
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
      console.log("Ignoring irrelevant event:", stripeEvent.type);
      return NextResponse.json({ received: true });
    }

    const obj      = stripeEvent.data.object as Stripe.Subscription;
    const metadata = obj.metadata || {};

    // Skip connected-account events
    if (metadata.connectAccountPayments || metadata.connectAccountSubscriptions) {
      console.log("Skipping connected account event:", stripeEvent.type);
      return NextResponse.json({ received: true });
    }

    switch (stripeEvent.type) {
      case "checkout.session.completed":
        await changeAttendanceType(
          metadata.attendeeId!,
          metadata.webinarId!,
          "CONVERTED"
        );
        // fall-through
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await updateSubscription(obj);
        console.log("Processed subscription event:", stripeEvent.type);
        return NextResponse.json({ received: true });

      default:
        console.log("Unhandled subscription event:", stripeEvent.type);
        return NextResponse.json({ received: true });
    }
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return new NextResponse(`Webhook Error: ${error.message}`, {
      status: error.statusCode || 500,
    });
  }
}

const getStripeEvent = async (
  body: string,
  sig: string | null
): Promise<Stripe.Event> => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    throw new Error("Missing signature or webhook secret");
  }
  return stripe.webhooks.constructEvent(body, sig, secret);
};
