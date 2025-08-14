"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Eye, EyeOff, Keyboard, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rtmpURL: string;
  streamKey: string;
};

const isValidRtmp = (url: string) => {
  try {
    const httpsLike = url.replace(/^rtmps?:\/\//, "https://");
    const u = new URL(httpsLike);
    return !!u.host && /stream|ingress|rtmp|video/i.test(u.host);
  } catch {
    return false;
  }
};

const ObsDialogBox = ({ open, onOpenChange, rtmpURL, streamKey }: Props) => {
  const urlRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => { if (open) urlRef.current?.focus(); }, [open]);

  const copyWithFallback = async (text: string) => {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      try {
        const el = taRef.current; if (!el) return false;
        el.value = text; el.select();
        const ok = document.execCommand("copy"); el.blur();
        return ok;
      } catch { return false; }
    }
  };

  const handleCopy = async (text: string, label: string) => {
    const ok = await copyWithFallback(text);
    ok ? toast.success(`${label} copied`) : toast.error(`Failed to copy ${label}`);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      const meta = e.metaKey || e.ctrlKey;
      if (e.key === "Escape") onOpenChange(false);
      if (meta && e.key.toLowerCase() === "c") { e.preventDefault(); handleCopy(rtmpURL, "RTMP URL"); }
      if (meta && e.key.toLowerCase() === "k") { e.preventDefault(); handleCopy(streamKey, "Stream Key"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange, rtmpURL, streamKey]);

  const validRtmp = useMemo(() => isValidRtmp(rtmpURL), [rtmpURL]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="obs-credentials-description">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            OBS Streaming Credentials
            <span className="ml-2 inline-flex items-center text-xs text-muted-foreground">
              <Keyboard className="h-4 w-4 mr-1" /> Esc • ⌘/Ctrl+C • ⌘/Ctrl+K
            </span>
          </DialogTitle>
          <DialogDescription id="obs-credentials-description">
            Use these values to configure your encoder. Keep your stream key secret.
          </DialogDescription>
        </DialogHeader>

        <textarea ref={taRef} className="sr-only absolute -left-[9999px]" aria-hidden />

        <div className="space-y-4 py-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" htmlFor="rtmp-url">RTMP URL</label>
              {validRtmp ? (
                <span className="inline-flex items-center text-emerald-500 text-xs">
                  <CheckCircle2 className="mr-1 h-4 w-4" /> Looks valid
                </span>
              ) : (
                <span className="inline-flex items-center text-amber-500 text-xs">
                  <AlertTriangle className="mr-1 h-4 w-4" /> Unusual URL
                </span>
              )}
            </div>
            <div className="flex mt-1">
              <Input id="rtmp-url" ref={urlRef} value={rtmpURL} readOnly className="flex-1" aria-invalid={!validRtmp} />
              <Button variant="outline" size="icon" className="ml-2" onClick={() => handleCopy(rtmpURL, "RTMP URL")}>
                <Copy size={16} />
              </Button>
            </div>
            {!validRtmp && (
              <p className="text-xs text-muted-foreground mt-1">
                Verify your RTMP server host/path with your streaming provider.
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="stream-key">Stream Key</label>
            <div className="flex mt-1">
              <Input id="stream-key" value={streamKey} readOnly type={revealed ? "text" : "password"} className="flex-1" />
              <Button variant="outline" size="icon" className="ml-2" aria-label={revealed ? "Hide key" : "Show key"} onClick={() => setRevealed(v => !v)}>
                {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
              <Button variant="outline" size="icon" className="ml-2" onClick={() => handleCopy(streamKey, "Stream Key")}>
                <Copy size={16} />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ObsDialogBox;
