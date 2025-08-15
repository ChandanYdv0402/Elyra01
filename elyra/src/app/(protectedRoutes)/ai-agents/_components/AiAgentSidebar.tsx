"use client";

import { memo, useMemo, useState, useCallback, useEffect, useRef } from "react";
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

const useDebounced = (value: string, ms = 200) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
};

type ItemProps = {
  item: AiAgents;
  index: number;
  activeIndex: number;
  selectedId?: string;
  onSelect: (a: AiAgents) => void;
};

const AssistantItem = memo(({ item, index, activeIndex, selectedId, onSelect }: ItemProps) => {
  const selected = item.id === selectedId;
  const active = index === activeIndex;
  return (
    <div
      role="option"
      aria-selected={selected}
      data-active={active ? "true" : "false"}
      className={`p-4 cursor-pointer ${
        selected ? "bg-primary/10" : active ? "bg-secondary/40" : ""
      } hover:bg-primary/20`}
      onClick={() => onSelect(item)}
      tabIndex={-1}
    >
      <div className="font-medium truncate">{item.name}</div>
    </div>
  );
});
AssistantItem.displayName = "AssistantItem";

const AiAgentSidebar = ({ aiAgents = [], userId }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 250);
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const { assistant, setAssistant } = useAiAgentStore();

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return q ? aiAgents.filter((a) => a.name.toLowerCase().includes(q)) : aiAgents;
  }, [aiAgents, debouncedQuery]);

  useEffect(() => setActiveIndex(0), [debouncedQuery]);

  const onSelect = useCallback((a: AiAgents) => setAssistant(a), [setAssistant]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      onSelect(filtered[activeIndex]);
    }
  };

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
        <div ref={listRef} role="listbox" aria-label="Assistants" onKeyDown={onKeyDown} tabIndex={0} className="outline-none">
          {aiAgents.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              You don’t have any assistants yet.{" "}
              <button className="underline" onClick={() => setIsModalOpen(true)}>
                Create your first one
              </button>
              .
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">No assistants match “{debouncedQuery}”.</div>
          ) : (
            filtered.map((a, i) => (
              <AssistantItem key={a.id} item={a} index={i} activeIndex={activeIndex} selectedId={assistant?.id} onSelect={onSelect} />
            ))
          )}
        </div>
      </ScrollArea>

      <CreateAssistantModal isOpen={isModalOpen} userId={userId} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default AiAgentSidebar;
