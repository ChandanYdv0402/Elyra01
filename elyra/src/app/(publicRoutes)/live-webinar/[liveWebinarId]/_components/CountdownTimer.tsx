"use client";

import React from "react";

interface Props {
  targetDate: Date;
  className?: string;
  webinarId: string;
  webinarStatus: any;
}

const CountdownTimer = ({ targetDate, className }: Props) => {
  return <div className={className}>Countdown Timer Placeholder</div>;
};

export default CountdownTimer;
