/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createAssistant } from "@/action/vapi";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const MIN_LEN = 2;
const MAX_LEN = 50;
const NAME_REGEX = /^[a-zA-Z0-9 _-]+$/; // allow letters, digits, space, underscore, hyphen

const toTitle = (s: string) =>
  s
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

const CreateAssistantModal = ({ isOpen, onClose, userId }: Props) => {
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const titleId = "create-assistant-title";
  const descId = "create-assistant-desc";

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const validate = (value: string) => {
    const clean = value.trim();
    if (clean.length < MIN_LEN) return `Name must be at least ${MIN_LEN} characters`;
    if (clean.length > MAX_LEN) return `Name must be at most ${MAX_LEN} characters`;
    if (!NAME_REGEX.test(clean)) return "Only letters, numbers, spaces, _ and - are allowed";
    return null;
  };

  const handleBlur = () => {
    const t = toTitle(name.trim());
    setName(t);
    if (err) setErr(validate(t));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const clean = name.trim();
    const v = validate(clean);
    if (v) {
      setErr(v);
      return;
    }

    setLoading(true);
    setErr(null);
    const tId = toast.loading("Creating assistant...");
    try {
      const res = await createAssistant(clean, userId);
      if (!res.success) throw new Error(res.message);
      router.refresh();
      setName("");
      onClose();
      toast.success("Assistant created successfully", { id: tId });
    } catch (error: any) {
      toast.error(error?.message || "Failed to create assistant", { id: tId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onMouseDown={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div className="bg-muted/80 rounded-lg w-full max-w-md p-6 border border-input shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 id={titleId} className="text-xl font-semibold">Create Assistant</h2>
          <button onClick={onClose} aria-label="Close dialog" className="text-neutral-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p id={descId} className="sr-only">Enter a name and press Create to add a new assistant.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-2">
            <div className="flex items-center justify-between">
              <label className="font-medium" htmlFor="assistant-name">Assistant Name</label>
              <span className="text-xs text-muted-foreground">{name.trim().length}/{MAX_LEN}</span>
            </div>
            <Input
              id="assistant-name"
              ref={inputRef}
              value={name}
              onChange={(e) => {
                setName(e.target.value.slice(0, MAX_LEN));
                setErr(null);
              }}
              onBlur={handleBlur}
              placeholder="Enter assistant name"
              className="bg-neutral-800 border-neutral-700"
              required
              aria-invalid={!!err}
              aria-describedby={err ? "assistant-name-error" : undefined}
            />
            {err && <p id="assistant-name-error" className="text-xs text-red-400 mt-2">{err}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" onClick={onClose} variant="outline">Cancel</Button>
            <Button type="submit" disabled={!name.trim() || !!validate(name) || loading}>
              {loading ? (<><Loader2 className="mr-2 animate-spin" />Creating...</>) : "Create Assistant"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssistantModal;
