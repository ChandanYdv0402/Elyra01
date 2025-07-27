"use server";

import { stripe } from "@/lib/stripe";
import { onAuthenticateUser } from "./auth";
import Stripe from "stripe";
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
  try {
    const session = await stripe.checkout.sessions.create(
      {
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
        metadata: { attendeeId, webinarId },
      },
      { stripeAccount: stripeId }
    );

    if (bookCall) {
      await changeAttendanceType(attendeeId, webinarId, "ADDED_TO_CART");
    }

    return { sessionUrl: session.url, status: 200, success: true };
  } catch (error) {
    console.log("Error creating checkout link", error);
    return { error: "Error creating checkout link", status: 500, success: false };
  }
};
