"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerAttendee, changeAttendanceType } from "@/action/attendance";
import { toast } from "sonner";
import { WebinarStatusEnum } from "@prisma/client";

type WaitListComponentProps = {
  webinarId: string;
  webinarStatus: WebinarStatusEnum;
  onRegistered?: () => void;
};

const WaitListComponent = ({ webinarId, webinarStatus, onRegistered }: WaitListComponentProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await registerAttendee({ name, email, webinarId });
      if (!res.success) throw new Error(res.message || "Failed to register");

      if (webinarStatus === WebinarStatusEnum.LIVE) {
        await changeAttendanceType(res.data!.attendeeId, webinarId, "ATTENDED");
      }

      toast.success(
        webinarStatus === WebinarStatusEnum.LIVE
          ? "Successfully joined the webinar!"
          : "Successfully registered for webinar"
      );
      setName("");
      setEmail("");
      setSubmitted(true);
      if (onRegistered) onRegistered();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          {webinarStatus === WebinarStatusEnum.LIVE ? "Join Webinar" : "Join Waitlist"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {webinarStatus === WebinarStatusEnum.LIVE ? "Join the Webinar" : "Join the Waitlist"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!submitted && (
            <>
              <Input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
              <Input type="email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} required />
            </>
          )}
          <Button type="submit" disabled={submitted}>
            {submitted
              ? webinarStatus === WebinarStatusEnum.LIVE
                ? "You're all set to join!"
                : "You've joined the waitlist!"
              : webinarStatus === WebinarStatusEnum.LIVE
              ? "Join Now"
              : "Join Waitlist"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WaitListComponent;
