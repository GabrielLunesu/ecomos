import * as React from "react";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  CircleDashed,
  CircleDot,
  HelpCircle,
  Info,
  Loader2,
  Pause,
  ShieldQuestion,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatusVariant } from "@/data/schema";

/**
 * Centralized semantic status system.
 * No page or component defines status colors inline — they map a
 * domain status to one of these variants and render <StatusBadge/>.
 */

type StatusStyle = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  /** surface (subtle) classes */
  surface: string;
  /** dot/icon accent color class */
  accent: string;
};

export const STATUS_CONFIG: Record<StatusVariant, StatusStyle> = {
  neutral: { label: "Neutral", icon: CircleDot, surface: "bg-muted text-muted-foreground", accent: "text-muted-foreground" },
  info: { label: "Info", icon: Info, surface: "bg-info-surface text-info-foreground", accent: "text-info" },
  "in-progress": { label: "In progress", icon: Loader2, surface: "bg-info-surface text-info-foreground", accent: "text-info" },
  success: { label: "Success", icon: CheckCircle2, surface: "bg-success-surface text-success-foreground", accent: "text-success" },
  warning: { label: "Warning", icon: AlertTriangle, surface: "bg-warning-surface text-warning-foreground", accent: "text-warning" },
  critical: { label: "Critical", icon: AlertTriangle, surface: "bg-critical-surface text-critical-foreground", accent: "text-critical" },
  blocked: { label: "Blocked", icon: Ban, surface: "bg-critical-surface text-critical-foreground", accent: "text-critical" },
  paused: { label: "Paused", icon: Pause, surface: "bg-muted text-muted-foreground", accent: "text-muted-foreground" },
  "awaiting-approval": { label: "Awaiting approval", icon: ShieldQuestion, surface: "bg-warning-surface text-warning-foreground", accent: "text-warning" },
  "outcome-uncertain": { label: "Outcome uncertain", icon: HelpCircle, surface: "bg-warning-surface text-warning-foreground", accent: "text-warning" },
  stale: { label: "Stale", icon: CircleDashed, surface: "bg-muted text-muted-foreground", accent: "text-warning" },
};

export function StatusBadge({
  variant,
  label,
  className,
  showIcon = true,
  size = "sm",
}: {
  variant: StatusVariant;
  /** Override the default variant label with domain copy. */
  label?: string;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "xs";
}) {
  const config = STATUS_CONFIG[variant];
  const Icon = config.icon;
  const spin = variant === "in-progress";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md font-medium whitespace-nowrap",
        size === "xs" ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-0.5 text-xs",
        config.surface,
        className,
      )}
      role="status"
    >
      {showIcon && <Icon className={cn("size-3 shrink-0", config.accent, spin && "animate-spin")} aria-hidden />}
      <span>{label ?? config.label}</span>
    </span>
  );
}

/** A bare colored dot + text, for dense table cells where a full badge is too heavy. */
export function StatusDot({
  variant,
  label,
  className,
}: {
  variant: StatusVariant;
  label?: string;
  className?: string;
}) {
  const config = STATUS_CONFIG[variant];
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm", className)}>
      <span className={cn("size-2 rounded-full bg-current", config.accent)} aria-hidden />
      <span>{label ?? config.label}</span>
    </span>
  );
}
