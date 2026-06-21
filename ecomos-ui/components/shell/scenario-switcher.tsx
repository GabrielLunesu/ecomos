"use client";

import { FlaskConical, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SCENARIO_IDS, SCENARIOS } from "@/data/scenario";
import { useScenarioStore } from "@/data/scenario-store";

const TONE_DOT: Record<string, string> = {
  neutral: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  critical: "bg-critical",
};

/**
 * Non-production scenario control. Switching deterministically drives every
 * page's data and resets simulated mutations. State is shareable via ?scenario=.
 */
export function ScenarioSwitcher() {
  const scenario = useScenarioStore((s) => s.scenario);
  const setScenario = useScenarioStore((s) => s.setScenario);
  const resetOverlays = useScenarioStore((s) => s.resetOverlays);
  const current = SCENARIOS[scenario];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-8"
          aria-label={`Review scenario: ${current.label}`}
          title={`Review scenario: ${current.label}`}
        >
          <FlaskConical className="size-4" />
          <span className={cn("absolute right-1.5 top-1.5 size-2 rounded-full ring-2 ring-card", TONE_DOT[current.tone])} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
          <FlaskConical className="size-3.5" /> Review scenario
        </DropdownMenuLabel>
        {SCENARIO_IDS.map((id) => {
          const s = SCENARIOS[id];
          return (
            <DropdownMenuItem
              key={id}
              onClick={() => setScenario(id)}
              className={cn("flex-col items-start gap-0.5 py-2", scenario === id && "bg-accent")}
            >
              <span className="flex w-full items-center gap-2">
                <span className={cn("size-2 rounded-full", TONE_DOT[s.tone])} />
                <span className="text-sm font-medium">{s.label}</span>
              </span>
              <span className="pl-4 text-[11px] leading-snug text-muted-foreground">{s.description}</span>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => resetOverlays()} className="gap-2 text-xs">
          <RotateCcw className="size-3.5" /> Reset simulated changes
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
