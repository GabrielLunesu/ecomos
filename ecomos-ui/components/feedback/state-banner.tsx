"use client";

import * as React from "react";
import { FlaskConical, Info, TriangleAlert, X, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type StateBannerTone = "info" | "warning" | "critical" | "stale" | "simulation";

const TONE_CONFIG: Record<
  StateBannerTone,
  { icon: React.ComponentType<{ className?: string }>; surface: string; accent: string }
> = {
  info: { icon: Info, surface: "bg-info-surface text-info-foreground", accent: "text-info" },
  warning: { icon: TriangleAlert, surface: "bg-warning-surface text-warning-foreground", accent: "text-warning" },
  critical: { icon: AlertCircle, surface: "bg-critical-surface text-critical-foreground", accent: "text-critical" },
  stale: { icon: Clock, surface: "bg-muted text-foreground", accent: "text-warning" },
  simulation: { icon: FlaskConical, surface: "bg-agent-surface text-agent-foreground", accent: "text-agent" },
};

/**
 * Non-blocking page/panel banner for degradation, stale data, disconnected
 * source, or a simulation notice. Distinguishes stale (last-good visible) from
 * failed via tone + copy. Optionally dismissable and may carry one action.
 */
export function StateBanner({
  tone = "info",
  title,
  description,
  action,
  dismissable = false,
  onDismiss,
  className,
}: {
  tone?: StateBannerTone;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: { label: string; onClick?: () => void };
  dismissable?: boolean;
  onDismiss?: () => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(true);
  if (!open) return null;
  const config = TONE_CONFIG[tone];
  const Icon = config.icon;

  return (
    <div
      role={tone === "critical" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm",
        config.surface,
        className,
      )}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", config.accent)} aria-hidden />
      <div className="min-w-0 flex-1">
        <div className="font-medium">{title}</div>
        {description && <div className="mt-0.5 text-xs opacity-90">{description}</div>}
      </div>
      {action && (
        <Button
          variant="outline"
          size="sm"
          className="h-7 shrink-0 bg-background/60"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
      {dismissable && (
        <button
          type="button"
          aria-label="Dismiss"
          className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100"
          onClick={() => {
            setOpen(false);
            onDismiss?.();
          }}
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
