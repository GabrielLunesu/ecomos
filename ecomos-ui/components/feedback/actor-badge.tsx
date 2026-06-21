import * as React from "react";
import { Bot, Cog, Plug, ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActorKind } from "@/data/schema";

/**
 * Distinguishes who performed an action. Human and agent activity share a
 * timeline but must remain visually distinguishable (design principle 7).
 */

const ACTOR_CONFIG: Record<
  ActorKind,
  { label: string; icon: React.ComponentType<{ className?: string }>; accent: string; surface: string }
> = {
  human: { label: "Person", icon: User, accent: "text-foreground", surface: "bg-muted text-foreground" },
  agent: { label: "Agent", icon: Bot, accent: "text-agent", surface: "bg-agent-surface text-agent-foreground" },
  system: { label: "System", icon: Cog, accent: "text-muted-foreground", surface: "bg-muted text-muted-foreground" },
  connector: { label: "Connector", icon: Plug, accent: "text-info", surface: "bg-info-surface text-info-foreground" },
  approval: { label: "Approval", icon: ShieldCheck, accent: "text-warning", surface: "bg-warning-surface text-warning-foreground" },
};

export function ActorBadge({
  kind,
  name,
  className,
  variant = "badge",
}: {
  kind: ActorKind;
  /** Optional actor name; falls back to the kind label. */
  name?: string;
  className?: string;
  variant?: "badge" | "inline";
}) {
  const config = ACTOR_CONFIG[kind];
  const Icon = config.icon;
  if (variant === "inline") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-sm", className)}>
        <Icon className={cn("size-3.5 shrink-0", config.accent)} aria-hidden />
        <span>{name ?? config.label}</span>
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        config.surface,
        className,
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      <span>{name ?? config.label}</span>
    </span>
  );
}

export { ACTOR_CONFIG };
