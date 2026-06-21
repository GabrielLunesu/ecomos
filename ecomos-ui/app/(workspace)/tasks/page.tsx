"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonScope } from "@/components/domain/tasks/person-scope";
import { TaskBoard } from "@/components/domain/tasks/task-board";
import { TaskDetailSheet } from "@/components/domain/tasks/task-detail-sheet";
import { useTasksBoardStore } from "@/data/tasks-board-store";

export default function TasksPage() {
  const addTask = useTasksBoardStore((s) => s.addTask);

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5 sm:px-6">
        <PersonScope />
        <Button size="sm" className="h-8 gap-1.5" onClick={() => addTask("backlog", "New task")}>
          <Plus className="size-4" /> Add task
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-x-auto">
        <TaskBoard />
      </div>

      <TaskDetailSheet />
    </div>
  );
}
