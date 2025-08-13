"use server";

import { getStreamClient } from "@/lib/stream/streamVideoClient";
import { Attendee } from "@prisma/client";
import { UserRequest } from "@stream-io/node-sdk";

export const getStreamIoToken = async (attendee: Attendee | null) => {
  try {
    const newUser: UserRequest = {
      id: attendee?.id || "guest",
      role: "user",
      name: attendee?.name || "Guest",
      image: `https://api.dicebear.com/7.x/initials/svg?seed=${attendee?.name || "Guest"}`,
    };

    await getStreamClient.upsertUsers([newUser]);

    // Valid for ~60 hours
    const validity = 60 * 60 * 60;
    const token = getStreamClient.generateUserToken({
      user_id: attendee?.id || "guest",
      validity_in_seconds: validity,
    });

    return token;
  } catch (error) {
    console.error("Error generating Stream Io token:", error);
    throw new Error("Failed to generate Stream Io token");
  }
};
