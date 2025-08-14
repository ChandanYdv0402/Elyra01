"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rtmpURL: string;
  streamKey: string;
};

const ObsDialogBox = ({ open, onOpenChange, rtmpURL, streamKey }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OBS Streaming Credentials</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">RTMP URL</label>
            <div className="flex">
              <Input value={rtmpURL} readOnly className="flex-1" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Stream Key</label>
            <div className="flex">
              <Input value={streamKey} readOnly type="password" className="flex-1" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Keep your stream key private. Never share it with others.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ObsDialogBox;
