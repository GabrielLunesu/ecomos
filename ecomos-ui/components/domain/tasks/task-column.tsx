"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StatusGlyph, type BOARD_STATUSES } from "@/components/domain/tasks/board-meta";
import { TaskCard } from "@/components/domain/tasks/task-card";
import type { BoardTask } from "@/data/tasks-board";
import { useTasksBoardStore } from "@/data/tasks-board-store";

type StatusMeta = (typeof BOARD_STATUSES)[number];

export function TaskColumn({ status, tasks }: { status: StatusMeta; tasks: BoardTask[] }) {
  const moveTask = useTasksBoardStore((s) => s.moveTask);
  const addTask = useTasksBoardStore((s) => s.addTask);
  const [isOver, setIsOver] = React.useState(false);

  return (
    <div className="flex h-full w-[300px] shrink-0 flex-col lg:w-[336px]">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          if (!isOver) setIsOver(true);
        }}
        onDragLeave={(e) => {
          // Only clear when leaving the column, not when moving over a child.
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          const id = e.dataTransfer.getData("text/plain");
          if (id) moveTask(id, status.id);
          setIsOver(false);
        }}
        className={cn(
          "flex max-h-full flex-col rounded-lg border bg-muted/60 p-3 transition-colors dark:bg-muted/40",
          isOver && "border-foreground/30 bg-accent/60 ring-2 ring-foreground/10",
        )}
      >
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-4 items-center justify-center">
              <StatusGlyph statusId={status.id} />
            </span>
            <span className="text-sm font-medium">{status.name}</span>
            <span className="rounded bg-background px-1.5 text-xs tabular-nums text-muted-foreground">{tasks.length}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            aria-label={`Add task to ${status.name}`}
            onClick={() => addTask(status.id, "New task")}
          >
            <Plus className="size-4" />
          </Button>
        </div>

        <div className="flex min-h-[40px] flex-col gap-3 overflow-y-auto">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addTask(status.id, "New task")}
            className="h-auto justify-start gap-2 self-start px-1 py-1 text-xs text-muted-foreground hover:bg-background"
          >
            <Plus className="size-4" /> Add task
          </Button>
        </div>
      </div>
    </div>
  );
}
