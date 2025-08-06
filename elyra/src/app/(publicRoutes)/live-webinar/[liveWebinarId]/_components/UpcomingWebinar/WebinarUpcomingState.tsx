"use client";

import React from "react";
import { Webinar, User, WebinarStatusEnum } from "@prisma/client";
import CountdownTimer from "./CountdownTimer";
import WaitListComponent from "./WaitListComponent";

type Props = {
  webinar: Webinar;
  currentUser: User | null;
};

const WebinarUpcomingState = ({ webinar, currentUser }: Props) => {
  if (webinar.webinarStatus === WebinarStatusEnum.ENDED) {
    return <div>Webinar ended</div>;
  }

  return (
    <div>
      <CountdownTimer
        targetDate={new Date(webinar.startTime)}
        webinarId={webinar.id}
        webinarStatus={webinar.webinarStatus}
      />
      {webinar.webinarStatus === WebinarStatusEnum.SCHEDULED && (
        <WaitListComponent
          webinarId={webinar.id}
          webinarStatus="SCHEDULED"
        />
      )}
      {webinar.webinarStatus === WebinarStatusEnum.WAITING_ROOM && (
        <WaitListComponent
          webinarId={webinar.id}
          webinarStatus="WAITING_ROOM"
        />
      )}
    </div>
  );
};

export default WebinarUpcomingState;
