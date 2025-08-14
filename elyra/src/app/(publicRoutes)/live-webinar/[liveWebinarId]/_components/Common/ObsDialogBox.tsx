"use client";

import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rtmpURL: string;
  streamKey: string;
};

const ObsDialogBox = ({ open, onOpenChange, rtmpURL, streamKey }: Props) => {
  const urlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) urlRef.current?.focus();
  }, [open]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch {
      toast.error(`Failed to copy ${label}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="obs-credentials-description">
        <DialogHeader>
          <DialogTitle>OBS Streaming Credentials</DialogTitle>
          <DialogDescription id="obs-credentials-description">
            Use these values to configure your encoder. Keep your stream key secret.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="rtmp-url">
              RTMP URL
            </label>
            <div className="flex">
              <Input id="rtmp-url" ref={urlRef} value={rtmpURL} readOnly className="flex-1" />
              <Button
                aria-label="Copy RTMP URL"
                variant="outline"
                size="icon"
                className="ml-2"
                onClick={() => copyToClipboard(rtmpURL, "RTMP URL")}
              >
                <Copy size={16} />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="stream-key">
              Stream Key
            </label>
            <div className="flex">
              <Input id="stream-key" value={streamKey} readOnly type="password" className="flex-1" />
              <Button
                aria-label="Copy Stream Key"
                variant="outline"
                size="icon"
                className="ml-2"
                onClick={() => copyToClipboard(streamKey, "Stream Key")}
              >
                <Copy size={16} />
              </Button>
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
