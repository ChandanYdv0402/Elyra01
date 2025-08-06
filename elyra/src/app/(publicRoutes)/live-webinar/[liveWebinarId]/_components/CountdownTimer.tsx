"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
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

  const formatNumber = (num: number) => num.toString().padStart(2, "0");
  const splitDigits = (num: number) => {
    const s = formatNumber(num);
    return [s.charAt(0), s.charAt(1)];
  };

  const [d1, d2] = splitDigits(timeLeft.days > 99 ? 99 : timeLeft.days);
  const [h1, h2] = splitDigits(timeLeft.hours);
  const [m1, m2] = splitDigits(timeLeft.minutes);
  const [s1, s2] = splitDigits(timeLeft.seconds);

  useEffect(() => {
    const calculate = async () => {
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

    const update = async () => setTimeLeft(await calculate());
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [targetDate, isExpired, webinarId, webinarStatus]);

  if (isExpired) return null;

  return (
    <div className={cn("text-center", className)}>
      <div className="flex items-center justify-center gap-2">
        {[d1, d2].map((d, i) => (
          <div key={i} className="bg-secondary w-8 h-10 flex items-center justify-center rounded text-xl">
            {d}
          </div>
        ))}
        :
        {[h1, h2].map((d, i) => (
          <div key={i} className="bg-secondary w-8 h-10 flex items-center justify-center rounded text-xl">
            {d}
          </div>
        ))}
        :
        {[m1, m2].map((d, i) => (
          <div key={i} className="bg-secondary w-8 h-10 flex items-center justify-center rounded text-xl">
            {d}
          </div>
        ))}
        :
        {[s1, s2].map((d, i) => (
          <div key={i} className="bg-secondary w-8 h-10 flex items-center justify-center rounded text-xl">
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
