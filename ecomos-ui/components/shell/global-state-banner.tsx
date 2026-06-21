"use client";

import { CircleSlash, Clock, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScenarioStore } from "@/data/scenario-store";
import type { ScenarioId } from "@/data/scenario";

type BannerSpec = {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  tone: "warning" | "critical";
} | null;

const BANNERS: Record<ScenarioId, BannerSpec> = {
  healthy: null,
  attention: null,
  incident: {
    icon: TriangleAlert,
    tone: "critical",
    text: "Active incident: Aurora Supply shipment delay affecting 14 orders. Cross-department impact is shown across Operations, Customer Service and Finance.",
  },
  empty: null,
  partial: {
    icon: TriangleAlert,
    tone: "warning",
    text: "Partial data: COGS is missing for a recent order cohort and Meta Ads is stale. Estimated figures are labelled and exclude unavailable inputs.",
  },
  stale: {
    icon: Clock,
    tone: "warning",
    text: "Stale data: showing last-good records. Some actions are paused pending a refresh.",
  },
  offline: {
    icon: CircleSlash,
    tone: "critical",
    text: "Offline / degraded: connectors are unavailable. Data is last-good and execution simulations are disabled.",
  },
};

const TONE: Record<"warning" | "critical", string> = {
  warning: "bg-warning-surface text-warning-foreground border-warning/30",
  critical: "bg-critical-surface text-critical-foreground border-critical/30",
};

export function GlobalStateBanner() {
  const scenario = useScenarioStore((s) => s.scenario);
  const spec = BANNERS[scenario];

  // Only render (and add a divider) when the scenario is genuinely degraded.
  // The always-on "prototype" notice now lives as a quiet pill in the header.
  if (!spec) return null;

  return (
    <div className="shrink-0">
      <div className={cn("flex items-center gap-2 border-b px-4 py-1.5 text-xs", TONE[spec.tone])}>
        <spec.icon className="size-3.5 shrink-0" />
        <span className="min-w-0 flex-1">{spec.text}</span>
      </div>
    </div>
  );
}
