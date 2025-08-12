"use client";

import { useState } from "react";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { User } from "@prisma/client";
import { WebinarWithPresenter } from "@/lib/type";

type Props = {
  apiKey: string;
  callId: string;
  webinar: WebinarWithPresenter;
  user: User;
};

const LiveStreamState = ({ apiKey, callId, webinar, user }: Props) => {
  const [hostToken, setHostToken] = useState<string | null>(null);
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  return null;
};

export default LiveStreamState;
