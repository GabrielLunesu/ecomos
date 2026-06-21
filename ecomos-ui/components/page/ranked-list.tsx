"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TrendBadge } from "@/components/metrics/metric-summary";
import { StatusBadge } from "@/components/feedback/status";
import type { StatusVariant, Trend } from "@/data/schema";

export type RankedRow = {
  id: string;
  label: string;
  sublabel?: string;
  /** Formatted display value (already a string — caller formats). */
  valueText?: string;
  /** Progress 0–1 for the inline bar. */
  progress?: number;
  trend?: Trend;
  invertTrend?: boolean;
  status?: StatusVariant;
  statusLabel?: string;
  href?: string;
};

/**
 * Semantic ranked list (replaces "top performers"). Rows carry value, progress,
 * status, trend, and a drill-down — color comes from category/severity, not
 * rank decoration.
 */
export function RankedList({ rows, className }: { rows: RankedRow[]; className?: string }) {
  return (
    <ul className={cn("divide-y", className)}>
      {rows.map((r) => {
        const inner = (
          <div className="flex items-center gap-3 py-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm">{r.label}</span>
                {r.status && <StatusBadge variant={r.status} label={r.statusLabel} size="xs" showIcon={false} />}
              </div>
              {r.sublabel && <div className="truncate text-[11px] text-muted-foreground">{r.sublabel}</div>}
              {typeof r.progress === "number" && (
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(2, Math.min(100, r.progress * 100))}%` }} />
                </div>
              )}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-0.5">
              {r.valueText && <span className="text-sm font-medium tabular-nums">{r.valueText}</span>}
              {r.trend && <TrendBadge trend={r.trend} invert={r.invertTrend} className="text-[11px]" />}
            </div>
          </div>
        );
        return (
          <li key={r.id}>
            {r.href ? (
              <Link href={r.href} className="block px-1 transition-colors hover:bg-accent/40">
                {inner}
              </Link>
            ) : (
              <div className="px-1">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
