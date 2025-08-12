/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Users, MessageSquare } from "lucide-react";
import {
  ParticipantView,
  useCallStateHooks,
  type Call,
} from "@stream-io/video-react-sdk";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { WebinarWithPresenter } from "@/lib/type";

type Props = {
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  webinar: WebinarWithPresenter;
  isHost?: boolean;
  username: string;
  userId: string;
  call: Call;
  userToken: string;
};

const LiveWebinarView = ({
  showChat,
  setShowChat,
  webinar,
  isHost = false,
  username,
  userId,
  userToken,
  call,
}: Props) => {
  const { useParticipants, useParticipantCount } = useCallStateHooks();
  const participants = useParticipants();
  const hostParticipant = participants.length > 0 ? participants[0] : null;
  const viewerCount = useParticipantCount();

  return (
    <div className="flex flex-col w-full h-screen max-h-screen overflow-hidden bg-background text-foreground">
      <div className="py-2 px-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-accent-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive animate-pulse"></span>
            </span>
            LIVE
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-muted/50 px-3 py-1 rounded-full">
            <Users size={16} />
            <span className="text-sm">{viewerCount}</span>
          </div>
          <button
            onClick={() => setShowChat(!showChat)}
            className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${
              showChat ? "bg-accent-primary text-primary-foreground" : "bg-muted/50"
            }`}
          >
            <MessageSquare size={16} />
            <span>Chat</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 p-2 gap-2 overflow-hidden">
        <div className="flex-1 rounded-lg overflow-hidden border border-border flex flex-col bg-card">
          <div className="flex-1 relative overflow-hidden">
            {hostParticipant ? (
              <div className="w-full h-full">
                <ParticipantView participant={hostParticipant} className="w-full h-full object-cover !max-w-full" />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground flex-col space-y-4">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <Users size={40} className="text-muted-foreground" />
                </div>
                <p>Waiting for stream to start...</p>
              </div>
            )}

            {isHost && (
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                Host
              </div>
            )}
          </div>

          <div className="p-2 border-t border-border flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <div className="text-sm font-medium capitalize">{webinar?.title}</div>
            </div>
          </div>
        </div>

        {/* Chat panel comes in next commits */}
      </div>
    </div>
  );
};

export default LiveWebinarView;
