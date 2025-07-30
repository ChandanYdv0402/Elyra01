"use server";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  console.log("Stripe webhook received");
  return NextResponse.json({ received: true });
}

// stub: parse & verify incoming webhook
const getStripeEvent = async (body: string, sig: string | null): Promise<Stripe.Event> => {
  throw new Error("Not implemented");
};
