"use client";

import { create } from "zustand";
import {
  BOARD_TASKS,
  type BoardStatusId,
  type BoardTask,
} from "@/data/tasks-board";

type State = {
  tasks: BoardTask[];
  /** Scope the board to a single person (assignee id) or all. */
  personFilter: string | null;
  /** Task open in the detail sheet. */
  selectedTaskId: string | null;

  setPersonFilter: (id: string | null) => void;
  openTask: (id: string) => void;
  closeTask: () => void;

  addTask: (statusId: BoardStatusId, title: string) => void;
  moveTask: (taskId: string, statusId: BoardStatusId) => void;
  toggleSubtodo: (taskId: string, subId: string) => void;
  addSubtodo: (taskId: string, title: string) => void;
  toggleAssignee: (taskId: string, personId: string) => void;
  setDueDate: (taskId: string, date: string) => void;
  addComment: (taskId: string) => void;
};

const STATUS_NAME: Record<BoardStatusId, string> = {
  backlog: "Backlog",
  "to-do": "Todo",
  "in-progress": "In Progress",
  "technical-review": "Technical Review",
  paused: "Paused",
  completed: "Completed",
};

let seq = 100;
const nextId = (prefix: string) => `${prefix}-${++seq}`;

function patch(tasks: BoardTask[], id: string, fn: (t: BoardTask) => BoardTask): BoardTask[] {
  return tasks.map((t) => (t.id === id ? fn(t) : t));
}

export const useTasksBoardStore = create<State>((set) => ({
  tasks: BOARD_TASKS,
  personFilter: null,
  selectedTaskId: null,

  setPersonFilter: (id) => set({ personFilter: id }),
  openTask: (id) => set({ selectedTaskId: id }),
  closeTask: () => set({ selectedTaskId: null }),

  addTask: (statusId, title) =>
    set((s) => {
      const id = nextId("NT");
      const task: BoardTask = {
        id,
        title: title.trim() || "Untitled task",
        description: "",
        statusId,
        assigneeIds: [],
        labelIds: [],
        priority: "no-priority",
        dueDate: null,
        comments: 0,
        links: 0,
        subtodos: [],
        attachments: [],
        timeline: [{ id: nextId("tl"), kind: "created", text: "created this task", actorInitials: "AB", at: "just now" }],
      };
      return { tasks: [...s.tasks, task], selectedTaskId: id };
    }),

  moveTask: (taskId, statusId) =>
    set((s) => ({
      tasks: patch(s.tasks, taskId, (t) =>
        t.statusId === statusId
          ? t
          : {
              ...t,
              statusId,
              timeline: [
                { id: nextId("tl"), kind: "status", text: `moved to ${STATUS_NAME[statusId]}`, actorInitials: "AB", at: "just now" },
                ...t.timeline,
              ],
            },
      ),
    })),

  toggleSubtodo: (taskId, subId) =>
    set((s) => ({
      tasks: patch(s.tasks, taskId, (t) => ({
        ...t,
        subtodos: t.subtodos.map((st) => (st.id === subId ? { ...st, done: !st.done } : st)),
      })),
    })),

  addSubtodo: (taskId, title) =>
    set((s) => ({
      tasks: patch(s.tasks, taskId, (t) => ({
        ...t,
        subtodos: [...t.subtodos, { id: nextId("st"), title, done: false }],
        timeline: [
          { id: nextId("tl"), kind: "subtask", text: `added sub-task “${title}”`, actorInitials: "AB", at: "just now" },
          ...t.timeline,
        ],
      })),
    })),

  toggleAssignee: (taskId, personId) =>
    set((s) => ({
      tasks: patch(s.tasks, taskId, (t) => {
        const has = t.assigneeIds.includes(personId);
        return {
          ...t,
          assigneeIds: has ? t.assigneeIds.filter((p) => p !== personId) : [...t.assigneeIds, personId],
          timeline: [
            { id: nextId("tl"), kind: "assignee", text: has ? "removed an assignee" : "tagged an assignee", actorInitials: "AB", at: "just now" },
            ...t.timeline,
          ],
        };
      }),
    })),

  setDueDate: (taskId, date) =>
    set((s) => ({ tasks: patch(s.tasks, taskId, (t) => ({ ...t, dueDate: date })) })),

  addComment: (taskId) =>
    set((s) => ({
      tasks: patch(s.tasks, taskId, (t) => ({
        ...t,
        comments: t.comments + 1,
        timeline: [
          { id: nextId("tl"), kind: "comment", text: "added a comment", actorInitials: "AB", at: "just now" },
          ...t.timeline,
        ],
      })),
    })),
}));
