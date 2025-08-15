"use client";

import { memo, useMemo, useState, useCallback } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateAssistantModal from "./CreateAssistantModal";
import { useAiAgentStore } from "@/store/useAiAgentStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AiAgents } from "@prisma/client";

type Props = {
  aiAgents: AiAgents[];
  userId: string;
};

type ItemProps = {
  item: AiAgents;
  selectedId?: string;
  onSelect: (a: AiAgents) => void;
};

const AssistantItem = memo(({ item, selectedId, onSelect }: ItemProps) => {
  const selected = item.id === selectedId;
  return (
    <button
      className={`w-full text-left p-4 ${selected ? "bg-primary/10" : ""} hover:bg-primary/20`}
      onClick={() => onSelect(item)}
      aria-current={selected ? "true" : "false"}
    >
      <div className="font-medium truncate">{item.name}</div>
    </button>
  );
});
AssistantItem.displayName = "AssistantItem";

const AiAgentSidebar = ({ aiAgents = [], userId }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { assistant, setAssistant } = useAiAgentStore();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return aiAgents;
    return aiAgents.filter((a) => a.name.toLowerCase().includes(q));
  }, [aiAgents, query]);

  const onSelect = useCallback((a: AiAgents) => setAssistant(a), [setAssistant]);

  return (
    <div className="w-[300px] border-r border-border flex flex-col">
      <div className="p-4">
        <Button className="w-full flex items-center gap-2 mb-4" onClick={() => setIsModalOpen(true)}>
          <Plus /> Create Assistant
        </Button>
        <div className="relative">
          <Input
            placeholder="Search Assistants"
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search assistants"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <ScrollArea className="mt-2 overflow-auto">
        {aiAgents.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            You don’t have any assistants yet.{" "}
            <button className="underline" onClick={() => setIsModalOpen(true)}>
              Create your first one
            </button>
            .
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">No assistants match “{query}”.</div>
        ) : (
          filtered.map((a) => (
            <AssistantItem key={a.id} item={a} selectedId={assistant?.id} onSelect={onSelect} />
          ))
        )}
      </ScrollArea>

      <CreateAssistantModal isOpen={isModalOpen} userId={userId} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default AiAgentSidebar;
