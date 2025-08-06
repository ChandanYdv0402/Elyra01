"use client";

import React from "react";
import { Webinar, User } from "@prisma/client";

type Props = {
  webinar: Webinar;
  currentUser: User | null;
};

const WebinarUpcomingState = ({ webinar, currentUser }: Props) => {
  return <div>WebinarUpcomingState</div>;
};

export default WebinarUpcomingState;
