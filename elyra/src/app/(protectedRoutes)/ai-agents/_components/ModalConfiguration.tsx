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

const useDebouncedValue = <T,>(value: T, delay = 300) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

const RECOMMENDED_MAX = 4000;
const PROVIDERS = ["openai", "anthropic", "google", "custom"] as const;
const MODELS = ["gpt-4o", "gpt-4.1", "claude-3.5-sonnet", "gemini-1.5-pro"] as const;

const ModelConfiguration = () => {
  const { assistant } = useAiAgentStore();

  const [loading, setLoading] = useState(false);
  const [firstMessage, setFirstMessage] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [provider, setProvider] = useState<string>("");
  const [model, setModel] = useState<string>("");

  const [initialFirst, setInitialFirst] = useState("");
  const [initialPrompt, setInitialPrompt] = useState("");
  const [initialProvider, setInitialProvider] = useState("");
  const [initialModel, setInitialModel] = useState("");

  const debouncedPrompt = useDebouncedValue(systemPrompt, 300);
  const charCount = debouncedPrompt.length;
  const overLimit = charCount > RECOMMENDED_MAX;

  useEffect(() => {
    if (assistant) {
      const f = assistant?.firstMessage || "";
      const p = assistant?.prompt || "";
      const prov = assistant?.provider || "openai";
      const mdl = assistant?.model || "gpt-4o";

      setFirstMessage(f);
      setSystemPrompt(p);
      setProvider(prov);
      setModel(mdl);

      setInitialFirst(f);
      setInitialPrompt(p);
      setInitialProvider(prov);
      setInitialModel(mdl);
    }
  }, [assistant]);

  const isDirty = useMemo(
    () =>
      firstMessage !== initialFirst ||
      debouncedPrompt !== initialPrompt ||
      provider !== initialProvider ||
      model !== initialModel,
    [firstMessage, initialFirst, debouncedPrompt, initialPrompt, provider, initialProvider, model, initialModel]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (!loading && isDirty) {
          handleUpdateAssistant();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loading, isDirty]); // eslint-disable-line

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
    const tId = toast.loading("Updating assistant...");
    try {
      // NOTE: this assumes your `updateAssistant` action supports provider/model fields.
      // If not, update the action accordingly or ignore these extra params server-side.
      const res = await updateAssistant(assistant.id, firstMessage, debouncedPrompt, provider, model);
      if (!res.success) throw new Error(res.message);
      toast.success("Assistant updated successfully", { id: tId });

      setInitialFirst(firstMessage);
      setInitialPrompt(debouncedPrompt);
      setInitialProvider(provider);
      setInitialModel(model);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update assistant";
      toast.error(msg, { id: tId });
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
        <Button type="submit" disabled={loading || !isDirty || overLimit}>
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
          <div className={`text-xs ${overLimit ? "text-red-400" : "text-neutral-500"}`}>
            {charCount}/{RECOMMENDED_MAX} {overLimit && "— exceeds recommended length"}
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
          <DropdownSelect
            value={provider}
            onChange={(val: string) => setProvider(val)}
            options={PROVIDERS.map((p) => ({ label: p, value: p }))}
          />
        </ConfigField>

        <ConfigField label="Model" showInfo>
          <DropdownSelect
            value={model}
            onChange={(val: string) => setModel(val)}
            options={MODELS.map((m) => ({ label: m, value: m }))}
          />
        </ConfigField>
      </div>
    </form>
  );
};

export default ModelConfiguration;
