"use client";

import { useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { WebinarWithPresenter } from "@/lib/type";

type Props = {
  username: string;
  callId: string;
  callType: string;
  webinar: WebinarWithPresenter;
  token: string;
};

const CustomLivestreamPlayer = ({ callId, webinar, callType, username, token }: Props) => {
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call>();

  return null;
};

export default CustomLivestreamPlayer;
