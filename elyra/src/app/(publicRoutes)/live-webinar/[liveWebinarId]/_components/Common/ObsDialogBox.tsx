"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rtmpURL: string;
  streamKey: string;
};

const ObsDialogBox = ({ open, onOpenChange, rtmpURL, streamKey }: Props) => {
  const urlRef = useRef<HTMLInputElement>(null);
  const [revealed, setRevealed] = useState(false);

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
          <div>
            <label className="text-sm font-medium" htmlFor="rtmp-url">RTMP URL</label>
            <div className="flex mt-1">
              <Input id="rtmp-url" ref={urlRef} value={rtmpURL} readOnly className="flex-1" />
              <Button variant="outline" size="icon" className="ml-2" onClick={() => copyToClipboard(rtmpURL, "RTMP URL")}>
                <Copy size={16} />
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="stream-key">Stream Key</label>
            <div className="flex mt-1">
              <Input id="stream-key" value={streamKey} readOnly type={revealed ? "text" : "password"} className="flex-1" />
              <Button
                variant="outline"
                size="icon"
                className="ml-2"
                aria-label={revealed ? "Hide key" : "Show key"}
                onClick={() => setRevealed(v => !v)}
              >
                {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
              <Button variant="outline" size="icon" className="ml-2" onClick={() => copyToClipboard(streamKey, "Stream Key")}>
                <Copy size={16} />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Reveal only when needed.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ObsDialogBox;
