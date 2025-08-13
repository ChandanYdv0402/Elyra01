"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAttendeeStore } from "@/store/useAttendeeStore";
import type { WebinarWithPresenter } from "@/lib/type";

type ParticipantProps = {
  apiKey: string;
  webinar: WebinarWithPresenter;
  callId: string;
};

const Participant = ({ apiKey, webinar, callId }: ParticipantProps) => {
  const { attendee } = useAttendeeStore();
  const [showChat, setShowChat] = useState<boolean>(true);

  if (!attendee) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="text-center max-w-md p-8 rounded-lg border border-border bg-card">
          <h2 className="text-2xl font-bold mb-4">Please register to join the webinar</h2>
          <p className="text-muted-foreground mb-6">
            Registration is required to participate in this webinar.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-accent-primary hover:bg-accent-primary/90 text-accent-foreground"
          >
            Register Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-background text-foreground">
      Joining {webinar.title}...
    </div>
  );
};

export default Participant;
