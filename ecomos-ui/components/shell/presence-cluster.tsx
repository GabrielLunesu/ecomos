"use client";

import { Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { TEAM } from "@/data/base/brand";

const PRESENCE_RING: Record<string, string> = {
  online: "bg-success",
  away: "bg-warning",
  offline: "bg-muted-foreground/40",
};

/** Two active agents currently working — visually distinct from people. */
const ACTIVE_AGENTS = [
  { id: "ag-cs", name: "CS Copilot", task: "Drafting WISMO replies" },
  { id: "ag-finance", name: "Finance Analyst", task: "Reconciling payouts" },
];

export function PresenceCluster() {
  const online = TEAM.filter((m) => m.presence !== "offline").slice(0, 3);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center -space-x-2 rounded-full transition-opacity hover:opacity-80"
          aria-label="People and agents present"
        >
          {online.map((m) => (
            <span key={m.id} className="relative">
              <Avatar className="size-6 border-2 border-card">
                <AvatarFallback className="text-[10px]">{m.initials}</AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  "absolute -bottom-0 -right-0 size-2 rounded-full border-2 border-card",
                  PRESENCE_RING[m.presence],
                )}
              />
            </span>
          ))}
          <span className="relative">
            <Avatar className="size-6 border-2 border-card">
              <AvatarFallback className="bg-agent-surface text-agent-foreground">
                <Bot className="size-3" />
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-0 -right-0 size-2 rounded-full border-2 border-card bg-agent" />
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="text-xs text-muted-foreground">People</DropdownMenuLabel>
        {TEAM.filter((m) => m.presence !== "offline").map((m) => (
          <DropdownMenuItem key={m.id} className="gap-2">
            <span className="relative">
              <Avatar className="size-5">
                <AvatarFallback className="text-[10px]">{m.initials}</AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  "absolute -bottom-0 -right-0 size-1.5 rounded-full border border-popover",
                  PRESENCE_RING[m.presence],
                )}
              />
            </span>
            <span className="flex-1">{m.name}</span>
            <span className="text-[11px] capitalize text-muted-foreground">{m.presence}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Active agents</DropdownMenuLabel>
        {ACTIVE_AGENTS.map((a) => (
          <DropdownMenuItem key={a.id} className="gap-2">
            <Avatar className="size-5">
              <AvatarFallback className="bg-agent-surface text-agent-foreground">
                <Bot className="size-3" />
              </AvatarFallback>
            </Avatar>
            <span className="flex-1">
              <span className="block leading-tight">{a.name}</span>
              <span className="block text-[11px] leading-tight text-muted-foreground">{a.task}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
