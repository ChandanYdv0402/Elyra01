"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Copy, Eye, EyeOff, Keyboard, CheckCircle2, AlertTriangle, FileDown, KeyRound, Loader2,
} from "lucide-react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rtmpURL: string;
  streamKey: string;
  onRegenerate?: () => Promise<string>; // optional server action to regenerate key
};

const isValidRtmp = (url: string) => {
  try {
    const u = new URL(url.replace(/^rtmps?:\/\//, "https://"));
    return !!u.host && /stream|ingress|rtmp|video/i.test(u.host);
  } catch { return false; }
};

const ObsDialogBox = ({ open, onOpenChange, rtmpURL, streamKey, onRegenerate }: Props) => {
  const urlRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [currentKey, setCurrentKey] = useState(streamKey);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (open) urlRef.current?.focus(); }, [open]);
  useEffect(() => { setCurrentKey(streamKey); }, [streamKey]);

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
      if (meta && e.key.toLowerCase() === "k") { e.preventDefault(); handleCopy(currentKey, "Stream Key"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange, rtmpURL, currentKey]);

  const validRtmp = useMemo(() => isValidRtmp(rtmpURL), [rtmpURL]);

  const downloadEnv = () => {
    const content = `# OBS/encoder credentials
RTMP_URL="${rtmpURL}"
STREAM_KEY="${currentKey}"
`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "stream.env";
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success(".env snippet downloaded");
  };

  const handleRegenerate = async () => {
    if (!onRegenerate) return toast.error("Regeneration not available");
    if (!confirm("Regenerate stream key? The old key will stop working immediately.")) return;
    setBusy(true);
    try {
      const newKey = await onRegenerate();
      setCurrentKey(newKey);
      toast.success("Stream key regenerated");
    } catch {
      toast.error("Failed to regenerate key");
    } finally {
      setBusy(false);
    }
  };

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
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="stream-key">Stream Key</label>
            <div className="flex mt-1">
              <Input id="stream-key" value={currentKey} readOnly type={revealed ? "text" : "password"} className="flex-1" />
              <Button variant="outline" size="icon" className="ml-2" aria-label={revealed ? "Hide key" : "Show key"} onClick={() => setRevealed(v => !v)}>
                {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
              <Button variant="outline" size="icon" className="ml-2" onClick={() => handleCopy(currentKey, "Stream Key")}>
                <Copy size={16} />
              </Button>
              <Button variant="outline" className="ml-2" onClick={handleRegenerate} disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4 mr-2" />} Regenerate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Regenerating invalidates the old key immediately.
            </p>
          </div>

          <Button onClick={downloadEnv} className="w-full">
            <FileDown className="mr-2 h-4 w-4" /> Download .env Snippet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ObsDialogBox;
