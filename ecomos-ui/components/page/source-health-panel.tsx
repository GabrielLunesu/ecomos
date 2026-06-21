"use client";

import * as React from "react";
import { CircleCheck, CircleSlash, Clock, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/formatting";
import type { SourceConnection } from "@/data/schema";

const STATUS_META: Record<
  SourceConnection["status"],
  { icon: React.ComponentType<{ className?: string }>; accent: string; label: string }
> = {
  healthy: { icon: CircleCheck, accent: "text-success", label: "Healthy" },
  stale: { icon: Clock, accent: "text-warning", label: "Stale" },
  partial: { icon: TriangleAlert, accent: "text-warning", label: "Partial" },
  disconnected: { icon: CircleSlash, accent: "text-critical", label: "Disconnected" },
};

/** Connection/source freshness and missing-data summary. */
export function SourceHealthPanel({ sources, className }: { sources: SourceConnection[]; className?: string }) {
  return (
    <ul className={cn("divide-y", className)}>
      {sources.map((s) => {
        const meta = STATUS_META[s.status];
        const Icon = meta.icon;
        return (
          <li key={s.id} className="flex items-start gap-2.5 py-2">
            <Icon className={cn("mt-0.5 size-4 shrink-0", meta.accent)} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm">{s.name}</span>
                <span className={cn("text-[11px] font-medium", meta.accent)}>{meta.label}</span>
              </div>
              <div className="text-[11px] text-muted-foreground">
                {s.lastSyncAt ? `Synced ${formatRelativeTime(s.lastSyncAt)}` : "No recent sync"}
                {s.missingDataNote ? ` · ${s.missingDataNote}` : ""}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
