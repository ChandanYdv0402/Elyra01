"use server";

import { stripe } from "@/lib/stripe";
import { onAuthenticateUser } from "./auth";
import Stripe from "stripe";
import { prismaClient } from "@/lib/prismaClient";
import { subscriptionPriceId } from "@/lib/data";
import { changeAttendanceType } from "./attendance";

export const getAllProductsFromStripe = async () => {
  /* same as Version 1 */
};

export const createCheckoutLink = async (
  priceId: string,
  stripeId: string,
  attendeeId: string,
  webinarId: string,
  bookCall: boolean = false
) => {
  /* same as Version 2 */
};

export const onGetStripeClientSecret = async (
  email: string,
  userId: string
) => {
  try {
    let customer: Stripe.Customer;
    const existing = await stripe.customers.list({ email });
    if (existing.data.length > 0) {
      customer = existing.data[0];
    } else {
      customer = await stripe.customers.create({
        email,
        metadata: { userId },
      });
    }

    await prismaClient.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: subscriptionPriceId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
      metadata: { userId },
    });

    const paymentIntent = (
      subscription.latest_invoice as Stripe.Invoice
    ).payment_intent as Stripe.PaymentIntent;

    return {
      status: 200,
      secret: paymentIntent.client_secret,
      customerId: customer.id,
    };
  } catch (error) {
    console.error("Subscription creation error:", error);
    return { status: 400, message: "Failed to create subscription" };
  }
};
