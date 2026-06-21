"use client";

import { CircleCheck, CircleSlash, PauseCircle, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { useScenarioStore } from "@/data/scenario-store";
import type { ScenarioId } from "@/data/scenario";

type SystemStatus = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
};

const STATUS_BY_SCENARIO: Record<ScenarioId, SystemStatus> = {
  healthy: { label: "All systems healthy", icon: CircleCheck, accent: "text-success" },
  attention: { label: "1 connection degraded", icon: TriangleAlert, accent: "text-warning" },
  incident: { label: "Operations incident active", icon: TriangleAlert, accent: "text-critical" },
  empty: { label: "No connections yet", icon: PauseCircle, accent: "text-muted-foreground" },
  partial: { label: "Partial data — 2 sources", icon: TriangleAlert, accent: "text-warning" },
  stale: { label: "Action queue paused", icon: PauseCircle, accent: "text-warning" },
  offline: { label: "Offline / demo mode", icon: CircleSlash, accent: "text-critical" },
};

export function SidebarSystemStatus() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const scenario = useScenarioStore((s) => s.scenario);
  const status = STATUS_BY_SCENARIO[scenario];
  const Icon = status.icon;

  if (collapsed) {
    return (
      <div className="flex justify-center py-1" title={status.label}>
        <Icon className={cn("size-4", status.accent)} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-md border bg-sidebar px-2.5 py-2">
      <Icon className={cn("size-4 shrink-0", status.accent)} />
      <span className="truncate text-xs text-muted-foreground">{status.label}</span>
    </div>
  );
}
