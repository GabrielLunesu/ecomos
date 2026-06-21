"use client";

import * as React from "react";
import { Calendar, FileText, Link as LinkIcon, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, CircularProgress, PriorityGlyph, StatusGlyph } from "@/components/domain/tasks/board-meta";
import { labelById, personById, progressOf, type BoardTask } from "@/data/tasks-board";
import { useTasksBoardStore } from "@/data/tasks-board-store";

export function TaskCard({ task }: { task: BoardTask }) {
  const openTask = useTasksBoardStore((s) => s.openTask);
  const progress = progressOf(task);
  const hasProgress = progress.total > 0;
  const isComplete = hasProgress && progress.completed === progress.total;

  return (
    <div
      role="button"
      tabIndex={0}
      draggable
      onClick={() => openTask(task.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter") openTask(task.id);
      }}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className="group shrink-0 cursor-grab overflow-hidden rounded-lg border bg-background transition-colors hover:border-foreground/20 active:cursor-grabbing"
    >
      <div className="px-3 py-2.5">
        <div className="mb-2 flex items-start gap-2">
          <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm bg-muted">
            <StatusGlyph statusId={task.statusId} />
          </div>
          <h3 className="flex-1 text-sm font-medium leading-tight">{task.title}</h3>
          {isComplete ? <CheckCircle2 className="size-4 shrink-0 text-success" /> : <PriorityGlyph priority={task.priority} className="size-4 shrink-0 text-current" />}
        </div>

        <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>

        {task.labelIds.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {task.labelIds.map((id) => {
              const l = labelById(id);
              if (!l) return null;
              return (
                <Badge key={id} variant="secondary" className={cn("px-1.5 py-0.5 text-[10px] font-medium", l.className)}>
                  {l.name}
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-dashed px-3 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {task.dueDate && <Chip icon={<Calendar className="size-3" />}>{task.dueDate}</Chip>}
            {task.comments > 0 && <Chip icon={<MessageSquare className="size-3" />}>{task.comments}</Chip>}
            {task.attachments.length > 0 && <Chip icon={<FileText className="size-3" />}>{task.attachments.length}</Chip>}
            {task.links > 0 && <Chip icon={<LinkIcon className="size-3" />}>{task.links}</Chip>}
            {hasProgress && (
              <Chip
                icon={
                  isComplete ? (
                    <CheckCircle2 className="size-3 text-success" />
                  ) : (
                    <CircularProgress value={(progress.completed / progress.total) * 100} />
                  )
                }
              >
                {progress.completed}/{progress.total}
              </Chip>
            )}
          </div>

          {task.assigneeIds.length > 0 && (
            <div className="flex -space-x-2">
              {task.assigneeIds.map((id) => {
                const p = personById(id);
                return (
                  <Avatar key={id} className="size-5 border-2 border-background">
                    <AvatarFallback className="text-[9px]">{p?.initials ?? "?"}</AvatarFallback>
                  </Avatar>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm border px-2 py-1">
      {icon}
      <span className="tabular-nums">{children}</span>
    </span>
  );
}
