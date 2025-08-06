"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerAttendee, changeAttendanceType } from "@/action/attendance";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { WebinarStatusEnum } from "@prisma/client";
import { useAttendeeStore } from "@/store/useAttendeeStore";
import { useRouter } from "next/navigation";

type WaitListComponentProps = {
  webinarId: string;
  webinarStatus: WebinarStatusEnum;
  onRegistered?: () => void;
};

const WaitListComponent = ({ webinarId, webinarStatus, onRegistered }: WaitListComponentProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { setAttendee } = useAttendeeStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await registerAttendee({ name, email, webinarId });
      if (!res.success) throw new Error(res.message || "Failed to register");

      if (res.data?.user) {
        setAttendee({
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          callStatus: "PENDING",
          createdAt: res.data.user.createdAt,
          updatedAt: res.data.user.updatedAt,
        });
      }
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

      setTimeout(() => {
        if (webinarStatus === WebinarStatusEnum.LIVE) router.refresh();
        if (onRegistered) onRegistered();
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={submitted} onOpenChange={() => setSubmitted(false)}>
      <DialogTrigger asChild>
        <Button
          className={
            webinarStatus === WebinarStatusEnum.LIVE
              ? "bg-red-600 hover:bg-red-700"
              : "bg-primary hover:bg-primary/90"
          }
        >
          {webinarStatus === WebinarStatusEnum.LIVE && <Loader2 className="animate-pulse mr-2" />}
          Join {webinarStatus === WebinarStatusEnum.LIVE ? "Now" : "Waitlist"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {webinarStatus === WebinarStatusEnum.LIVE ? "Join the Webinar" : "Join the Waitlist"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          {!submitted && (
            <>
              <Input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
              <Input type="email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} required />
            </>
          )}
          <Button type="submit" disabled={isSubmitting || submitted}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                {webinarStatus === WebinarStatusEnum.LIVE ? "Joining..." : "Registering..."}
              </>
            ) : submitted ? (
              webinarStatus === WebinarStatusEnum.LIVE
                ? "You're all set to join!"
                : "You've joined the waitlist!"
            ) : webinarStatus === WebinarStatusEnum.LIVE ? (
              "Join Now"
            ) : (
              "Join Waitlist"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WaitListComponent;
