"use client";

import * as React from "react";
import { BOARD_STATUSES } from "@/components/domain/tasks/board-meta";
import { TaskColumn } from "@/components/domain/tasks/task-column";
import { useTasksBoardStore } from "@/data/tasks-board-store";
import type { BoardStatusId, BoardTask } from "@/data/tasks-board";

export function TaskBoard() {
  const tasks = useTasksBoardStore((s) => s.tasks);
  const personFilter = useTasksBoardStore((s) => s.personFilter);

  const byStatus = React.useMemo(() => {
    const scoped = personFilter ? tasks.filter((t) => t.assigneeIds.includes(personFilter)) : tasks;
    const map = {} as Record<BoardStatusId, BoardTask[]>;
    for (const s of BOARD_STATUSES) map[s.id] = [];
    for (const t of scoped) map[t.statusId]?.push(t);
    return map;
  }, [tasks, personFilter]);

  return (
    <div className="flex h-full min-w-max gap-3 px-4 pb-3 pt-3 sm:px-6">
      {BOARD_STATUSES.map((status) => (
        <TaskColumn key={status.id} status={status} tasks={byStatus[status.id]} />
      ))}
    </div>
  );
}
