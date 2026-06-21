"use client";

import * as React from "react";
import { CircleCheck, CircleSlash, Clock, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/formatting";
import type { Freshness } from "@/data/schema";

/**
 * Data-freshness indicator: updated timestamp, source count, and health.
 * Context is always visible (design principle 5); never hide freshness.
 */

const FRESHNESS_CONFIG: Record<
  Freshness["status"],
  { label: string; icon: React.ComponentType<{ className?: string }>; accent: string }
> = {
  healthy: { label: "Up to date", icon: CircleCheck, accent: "text-success" },
  stale: { label: "Stale", icon: Clock, accent: "text-warning" },
  partial: { label: "Partial", icon: TriangleAlert, accent: "text-warning" },
  disconnected: { label: "Disconnected", icon: CircleSlash, accent: "text-critical" },
};

export function FreshnessIndicator({
  freshness,
  onOpenSources,
  className,
}: {
  freshness: Freshness;
  onOpenSources?: () => void;
  className?: string;
}) {
  const config = FRESHNESS_CONFIG[freshness.status];
  const Icon = config.icon;
  const body = (
    <>
      <Icon className={cn("size-3.5 shrink-0", config.accent)} aria-hidden />
      <span className="text-muted-foreground">
        {freshness.status === "disconnected" ? (
          <>Disconnected · {freshness.sourceCount} sources</>
        ) : (
          <>
            Updated {formatRelativeTime(freshness.updatedAt)}
            {freshness.sourceCount > 0 && <> · {freshness.sourceCount} sources</>}
          </>
        )}
      </span>
    </>
  );

  if (onOpenSources) {
    return (
      <button
        type="button"
        onClick={onOpenSources}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs hover:bg-accent transition-colors",
          className,
        )}
      >
        {body}
        <span className="text-muted-foreground/60 underline-offset-2 group-hover:underline">Sources</span>
      </button>
    );
  }

  return <span className={cn("inline-flex items-center gap-1.5 text-xs", className)}>{body}</span>;
}

export { FRESHNESS_CONFIG };
