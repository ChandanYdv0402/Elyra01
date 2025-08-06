"use client";

import React, { useState, useEffect } from "react";
import { changeWebinarStatus } from "@/action/webinar";
import { WebinarStatusEnum } from "@prisma/client";

interface Props {
  targetDate: Date;
  className?: string;
  webinarId: string;
  webinarStatus: WebinarStatusEnum;
}

const CountdownTimer = ({
  targetDate,
  className,
  webinarId,
  webinarStatus,
}: Props) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = async () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        if (!isExpired && webinarStatus === WebinarStatusEnum.SCHEDULED) {
          setIsExpired(true);
          await changeWebinarStatus(webinarId, WebinarStatusEnum.WAITING_ROOM);
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    const update = async () => setTimeLeft(await calculateTimeLeft());
    update();
    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, [targetDate, isExpired, webinarId, webinarStatus]);

  return (
    <div className={className}>
      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  );
};

export default CountdownTimer;
