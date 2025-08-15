"use client";

import { useEffect, useMemo, useState } from "react";
import { Info, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import ConfigField from "./ConfigField";
import DropdownSelect from "./DropDownSelect";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAiAgentStore } from "@/store/useAiAgentStore";
import { updateAssistant } from "@/actions/vapi";
import { toast } from "sonner";

const ModelConfiguration = () => {
  const { assistant } = useAiAgentStore();

  const [loading, setLoading] = useState(false);
  const [firstMessage, setFirstMessage] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  const [initialFirst, setInitialFirst] = useState("");
  const [initialPrompt, setInitialPrompt] = useState("");

  useEffect(() => {
    if (assistant) {
      const f = assistant?.firstMessage || "";
      const p = assistant?.prompt || "";
      setFirstMessage(f);
      setSystemPrompt(p);
      setInitialFirst(f);
      setInitialPrompt(p);
    }
  }, [assistant]);

  const isDirty = useMemo(
    () => firstMessage !== initialFirst || systemPrompt !== initialPrompt,
    [firstMessage, initialFirst, systemPrompt, initialPrompt]
  );

  if (!assistant) {
    return (
      <div className="flex justify-center items-center h-[500px] w-full">
        <div className="rounded-xl p-10 w-full max-w-xl text-center border border-dashed border-border bg-neutral-900/60">
          <Info className="mx-auto mb-3 h-5 w-5 text-neutral-400" />
          <p className="text-primary/80">
            No assistant selected. Please select an assistant to configure the model settings.
          </p>
        </div>
      </div>
    );
  }

  const handleUpdateAssistant = async () => {
    if (!isDirty) return;
    setLoading(true);
    try {
      const res = await updateAssistant(assistant.id, firstMessage, systemPrompt);
      if (!res.success) throw new Error(res.message);
      toast.success("Assistant updated successfully");
      setInitialFirst(firstMessage);
      setInitialPrompt(systemPrompt);
    } catch (error) {
      toast.error("Failed to update assistant");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!loading) await handleUpdateAssistant();
  };

  return (
    <form className="bg-neutral-900 rounded-xl p-6 mb-6" onSubmit={onSubmit}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Model</h2>
        <Button type="submit" disabled={loading || !isDirty}>
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Updating...
            </>
          ) : (
            "Update Assistant"
          )}
        </Button>
      </div>

      <p className="text-neutral-400 mb-6">Configure the behavior of the assistant.</p>

      <div className="mb-6">
        <div className="flex items-center mb-2">
          <label className="font-medium">First Message</label>
          <Info className="h-4 w-4 text-neutral-500 ml-2" />
        </div>
        <Input
          value={firstMessage}
          onChange={(e) => setFirstMessage(e.target.value)}
          className="bg-primary/10 border-input"
        />
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <label className="font-medium">System Prompt</label>
            <Info className="h-4 w-4 text-neutral-500 ml-2" />
          </div>
        </div>
        <Textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="min-h-[300px] max-h-[500px] bg-primary/10 border-input font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ConfigField label="Provider">
          <DropdownSelect value={assistant?.provider || ""} />
        </ConfigField>

        <ConfigField label="Model" showInfo>
          <DropdownSelect value={assistant?.model || ""} />
        </ConfigField>
      </div>
    </form>
  );
};

export default ModelConfiguration;
