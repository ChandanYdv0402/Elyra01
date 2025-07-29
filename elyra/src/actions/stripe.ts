"use server";

import { stripe } from "@/lib/stripe";
import { onAuthenticateUser } from "./auth";
import Stripe from "stripe";
import { prismaClient } from "@/lib/prismaClient";
import { subscriptionPriceId } from "@/lib/data";
import { changeAttendanceType } from "./attendance";
import { AttendedTypeEnum } from "@prisma/client";

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
  /* same as Version 3 */
};

export const updateSubscription = async (subscription: Stripe.Subscription) => {
  try {
    const userId = subscription.metadata.userId;
    await prismaClient.user.update({
      where: { id: userId },
      data: { subscription: subscription.status === "active" },
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
  }
};

export const updateAttendee = async (attendeeId: string) => {
  try {
    await prismaClient.attendance.update({
      where: { id: attendeeId },
      data: { attendedType: AttendedTypeEnum.CONVERTED },
    });
  } catch (error) {
    console.error("Error updating attendee:", error);
  }
};
