"use client";

import * as React from "react";
import { ChevronRight, TriangleAlert, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/formatting";
import type { Trace, TraceStageRecord } from "@/data/schema";

const STAGE_LABELS: Record<TraceStageRecord["stage"], string> = {
  trigger: "Trigger",
  context: "Context assembled",
  evidence: "Evidence retrieved",
  decision: "Decision / proposal",
  "tool-calls": "Tool calls",
  approval: "Approval / policy",
  "external-result": "External result",
  "final-result": "Final result",
};

/** Expandable execution-trace timeline. Errors and uncertainty are surfaced, never normalised away. */
export function TraceTimeline({ trace, className }: { trace: Trace; className?: string }) {
  return (
    <ol className={cn("space-y-0", className)}>
      {trace.stages.map((s, i) => (
        <StageRow key={s.stage} stage={s} last={i === trace.stages.length - 1} defaultOpen={Boolean(s.error || s.uncertainty)} />
      ))}
    </ol>
  );
}

function StageRow({ stage, last, defaultOpen }: { stage: TraceStageRecord; last: boolean; defaultOpen: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const hasDetail = stage.excerpts.length > 0 || stage.error || stage.uncertainty;
  const accent = stage.error ? "text-critical" : stage.uncertainty ? "text-warning" : "text-info";

  return (
    <li className="relative flex gap-3 pb-3 last:pb-0">
      <div className="flex flex-col items-center">
        <span className={cn("mt-1 size-2.5 rounded-full bg-current", accent)} />
        {!last && <span className="w-px flex-1 bg-border" />}
      </div>
      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={() => hasDetail && setOpen((v) => !v)}
          className={cn("flex w-full items-center gap-2 text-left", hasDetail && "cursor-pointer")}
        >
          <span className="text-sm font-medium">{STAGE_LABELS[stage.stage]}</span>
          {stage.error && <TriangleAlert className="size-3.5 text-critical" />}
          {stage.uncertainty && !stage.error && <HelpCircle className="size-3.5 text-warning" />}
          <time className="ml-auto text-[11px] text-muted-foreground" dateTime={stage.timestamp}>
            {formatTime(stage.timestamp)}
          </time>
          {hasDetail && <ChevronRight className={cn("size-3.5 text-muted-foreground transition-transform", open && "rotate-90")} />}
        </button>
        <p className="mt-0.5 text-xs text-muted-foreground">{stage.summary}</p>
        {open && hasDetail && (
          <div className="mt-2 space-y-1.5 rounded-md border bg-muted/30 p-2.5 text-xs">
            {stage.excerpts.map((ex, i) => (
              <div key={i} className="border-l-2 border-border pl-2 text-muted-foreground">
                “{ex}”
              </div>
            ))}
            {stage.uncertainty && (
              <div className="flex items-start gap-1.5 text-warning-foreground">
                <HelpCircle className="mt-0.5 size-3.5 shrink-0 text-warning" />
                <span>{stage.uncertainty}</span>
              </div>
            )}
            {stage.error && (
              <div className="flex items-start gap-1.5 text-critical-foreground">
                <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-critical" />
                <span>{stage.error}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
