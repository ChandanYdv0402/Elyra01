/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { useState } from "react";
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

const CreateAssistantModal = ({ isOpen, onClose, userId }: Props) => {
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // prevent double-submit

    const clean = name.trim();
    if (clean.length < MIN_LEN) {
      setErr(`Name must be at least ${MIN_LEN} characters`);
      return;
    }

    setLoading(true);
    setErr(null);
    try {
      const res = await createAssistant(clean, userId);
      if (!res.success) throw new Error(res.message);
      router.refresh();
      setName("");
      onClose();
      toast.success("Assistant created successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to create assistant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-muted/80 rounded-lg w-full max-w-md p-6 border border-input shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create Assistant</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-2">
            <label className="block font-medium mb-2">Assistant Name</label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (err) setErr(null);
              }}
              placeholder="Enter assistant name"
              className="bg-neutral-800 border-neutral-700"
              required
            />
            {err && <p className="text-xs text-red-400 mt-2">{err}</p>}
          </div>

        <div className="flex justify-end gap-3 mt-4">
            <Button type="button" onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Assistant"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssistantModal;
