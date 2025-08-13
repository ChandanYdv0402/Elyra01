"use client";

import { useState, useEffect } from "react";
import {
  StreamVideoClient,
  type User,
  type Call,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useAttendeeStore } from "@/store/useAttendeeStore";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getStreamIoToken } from "@/action/stremIo";
import type { WebinarWithPresenter } from "@/lib/type";

type ParticipantProps = {
  apiKey: string;
  webinar: WebinarWithPresenter;
  callId: string;
};

const Participant = ({ apiKey, webinar, callId }: ParticipantProps) => {
  const { attendee } = useAttendeeStore();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const initClient = async () => {
      try {
        const user: User = {
          id: attendee?.id || "guest",
          name: attendee?.name || "Guest",
          image: `https://api.dicebear.com/7.x/initials/svg?seed=${attendee?.name || "Guest"}`,
        };

        const userToken = await getStreamIoToken(attendee);
        setToken(userToken);

        const streamClient = new StreamVideoClient({ apiKey, user, token: userToken });
        await streamClient.connectUser(user, userToken);

        const streamCall = streamClient.call("livestream", callId);
        await streamCall.join({ create: true });

        setClient(streamClient);
        setCall(streamCall);
      } catch (e) {
        console.error("Error initializing client or joining call:", e);
      }
    };

    if (attendee) initClient();
  }, [apiKey, attendee, callId]);

  if (!attendee) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="text-center max-w-md p-8 rounded-lg border border-border bg-card">
          <h2 className="text-2xl font-bold mb-4">Please register to join the webinar</h2>
          <p className="text-muted-foreground mb-6">Registration is required to participate in this webinar.</p>
          <Button onClick={() => window.location.reload()}>Register Now</Button>
        </div>
      </div>
    );
  }

  if (!client || !call || !token) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Connecting to {webinar.title}…</p>
        </div>
      </div>
    );
  }

  return <div className="h-screen w-full">Connected</div>;
};

export default Participant;
