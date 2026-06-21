import * as React from "react";
import {
  Inbox,
  SearchX,
  CheckCircle2,
  PlugZap,
  EyeOff,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type EmptyStateVariant =
  | "first-use"
  | "no-results"
  | "zero-activity"
  | "unavailable-connection"
  | "hidden-module";

type VariantPreset = {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
};

const VARIANT_PRESETS: Record<EmptyStateVariant, VariantPreset> = {
  "first-use": {
    icon: Inbox,
    title: "Nothing here yet",
    description: "Connect a data source to populate this view.",
    accent: "text-info",
  },
  "no-results": {
    icon: SearchX,
    title: "No matching results",
    description: "No records match the current search and filters.",
    accent: "text-muted-foreground",
  },
  "zero-activity": {
    icon: CheckCircle2,
    title: "All clear",
    description: "Nothing needs your attention right now.",
    accent: "text-success",
  },
  "unavailable-connection": {
    icon: PlugZap,
    title: "Source unavailable",
    description: "This view depends on a connector that is currently disconnected.",
    accent: "text-critical",
  },
  "hidden-module": {
    icon: EyeOff,
    title: "Module not enabled",
    description: "This optional module is hidden. Enable a preview to explore it.",
    accent: "text-muted-foreground",
  },
};

/**
 * EmptyState distinguishes genuinely different "nothing to show" cases
 * (INTERACTION-STATES): first-use setup, filtered no-results, zero activity,
 * a disconnected source, and a hidden optional module. Each may carry an
 * action and reset slot. Title/description default per variant but can be
 * overridden with domain copy.
 */
export function EmptyState({
  variant = "first-use",
  icon,
  title,
  description,
  action,
  secondary,
  className,
  compact = false,
}: {
  variant?: EmptyStateVariant;
  icon?: LucideIcon;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Primary action slot (e.g. a Button) or { label, onClick }. */
  action?: React.ReactNode;
  /** Secondary slot — e.g. a "Reset filters" link for no-results. */
  secondary?: React.ReactNode;
  className?: string;
  compact?: boolean;
}) {
  const preset = VARIANT_PRESETS[variant];
  const Icon = icon ?? preset.icon;
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "gap-2 py-8" : "gap-3 py-14",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-muted",
          compact ? "size-9" : "size-12",
        )}
      >
        <Icon className={cn(compact ? "size-4.5" : "size-6", preset.accent)} aria-hidden />
      </div>
      <div className="space-y-1">
        <p className={cn("font-medium", compact ? "text-sm" : "text-base")}>
          {title ?? preset.title}
        </p>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {description ?? preset.description}
        </p>
      </div>
      {(action || secondary) && (
        <div className="mt-1 flex items-center gap-2">
          {action}
          {secondary}
        </div>
      )}
    </div>
  );
}
