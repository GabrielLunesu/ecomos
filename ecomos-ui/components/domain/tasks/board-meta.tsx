import * as React from "react";
import { CheckCircle2, Hexagon, Info, Stars } from "lucide-react";
import type { BoardPriority, BoardStatusId } from "@/data/tasks-board";

/** Workflow status identity colors (category color, not the semantic status system). */
type StatusMeta = { id: BoardStatusId; name: string; color: string };

export const BOARD_STATUSES: StatusMeta[] = [
  { id: "backlog", name: "Backlog", color: "#8b8d93" },
  { id: "to-do", name: "Todo", color: "#8b8d93" },
  { id: "in-progress", name: "In Progress", color: "#eab308" },
  { id: "technical-review", name: "Technical Review", color: "#22c55e" },
  { id: "paused", name: "Paused", color: "#0ea5e9" },
  { id: "completed", name: "Completed", color: "#8b5cf6" },
];

/** Linear-style circular status glyph (adapted from tasks-inspo). */
export function StatusGlyph({ statusId, size = 14 }: { statusId: BoardStatusId; size?: number }) {
  const color = BOARD_STATUSES.find((s) => s.id === statusId)?.color ?? "#8b8d93";
  const ring = (dash: string, offset = -0.7) => (
    <circle cx="7" cy="7" r="6" fill="none" stroke={color} strokeWidth="2" strokeDasharray={dash} strokeDashoffset={offset} />
  );
  const fillArc = (dash: string) => (
    <circle cx="7" cy="7" r="2" fill="none" stroke={color} strokeWidth="4" strokeDasharray={`${dash} 100`} transform="rotate(-90 7 7)" />
  );

  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden>
      {statusId === "backlog" ? (
        <>
          <circle cx="7" cy="7" r="6" fill="none" stroke={color} strokeWidth="2" strokeDasharray="1.4 1.74" strokeDashoffset="0.65" />
          {fillArc("0")}
        </>
      ) : statusId === "to-do" ? (
        <>
          {ring("3.14 0")}
          {fillArc("0")}
        </>
      ) : statusId === "in-progress" ? (
        <>
          {ring("3.14 0")}
          {fillArc("2.08")}
        </>
      ) : statusId === "technical-review" ? (
        <>
          {ring("3.14 0")}
          {fillArc("4.17")}
        </>
      ) : statusId === "paused" ? (
        <>
          {ring("3.14 0")}
          {fillArc("6.25")}
        </>
      ) : (
        <>
          {ring("3.14 0")}
          <path d="M4.5 7L6.5 9L9.5 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

/** Priority glyph shown on the card / detail (no glyph for low / no-priority). */
export function PriorityGlyph({ priority, className }: { priority: BoardPriority; className?: string }) {
  if (priority === "urgent") return <Stars className={className ?? "size-4 text-accent-pink"} />;
  if (priority === "high") return <Info className={className ?? "size-4 text-critical"} />;
  if (priority === "medium") return <Hexagon className={className ?? "size-4 text-info"} />;
  return null;
}

export const PRIORITY_LABEL: Record<BoardPriority, string> = {
  "no-priority": "No priority",
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export { CheckCircle2 };

/** Tiny inline circular progress (replaces react-circular-progressbar). */
export function CircularProgress({ value, size = 14, stroke = 2.4 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="stroke-muted" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        className="stroke-success"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (pct / 100) * c}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}
