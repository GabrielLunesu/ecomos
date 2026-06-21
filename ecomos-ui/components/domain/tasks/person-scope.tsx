"use client";

import { Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { BOARD_PEOPLE } from "@/data/tasks-board";
import { useTasksBoardStore } from "@/data/tasks-board-store";

/** Per-person scope: filters the whole board to one assignee. */
export function PersonScope() {
  const personFilter = useTasksBoardStore((s) => s.personFilter);
  const setPersonFilter = useTasksBoardStore((s) => s.setPersonFilter);

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs text-muted-foreground sm:inline">Scope</span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setPersonFilter(null)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
            personFilter === null ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent",
          )}
        >
          <Users className="size-3.5" /> Everyone
        </button>
        {BOARD_PEOPLE.map((p) => {
          const active = personFilter === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setPersonFilter(active ? null : p.id)}
              title={p.name}
              aria-pressed={active}
              className={cn(
                "rounded-full ring-2 transition-all",
                active ? "ring-primary" : "ring-transparent hover:ring-border",
              )}
            >
              <Avatar className="size-7">
                <AvatarFallback className="text-[10px]">{p.initials}</AvatarFallback>
              </Avatar>
            </button>
          );
        })}
      </div>
    </div>
  );
}
