"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Webinar, WebinarStatusEnum } from "@prisma/client";
import { Loader2 } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import WaitListComponent from "./WaitListComponent";
import { changeWebinarStatus } from "@/action/webinar";
import { sendBulkEmail } from "@/action/resend";
import { createAndStartStream } from "@/action/stremIo";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  webinar: Webinar;
  currentUser: User | null;
};

const WebinarUpcomingState = ({ webinar, currentUser }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStartWebinar = async () => {
    setLoading(true);
    try {
      if (!currentUser?.id) {
        throw new Error("User not authenticated");
      }
      await createAndStartStream(webinar);
      const res = await changeWebinarStatus(webinar.id, "LIVE");
      if (!res.success) {
        throw new Error(res.message);
      }
      await sendBulkEmail(webinar.id);
      router.refresh();
      toast.success("Webinar started successfully");
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  if (
    webinar.webinarStatus === WebinarStatusEnum.WAITING_ROOM &&
    currentUser?.id === webinar.presenterId
  ) {
    return (
      <Button onClick={handleStartWebinar} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            Starting...
          </>
        ) : (
          "Start Webinar"
        )}
      </Button>
    );
  }

  return (
    <CountdownTimer
      targetDate={new Date(webinar.startTime)}
      webinarId={webinar.id}
      webinarStatus={webinar.webinarStatus}
    />
  );
};

export default WebinarUpcomingState;
