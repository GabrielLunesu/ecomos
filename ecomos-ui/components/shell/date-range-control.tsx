"use client";

import { Check, ChevronDown, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { PERIODS, periodMeta } from "@/data/scenario";
import { useScenarioStore } from "@/data/scenario-store";

/**
 * Global analysis-window control. Changing it recomputes the analytical
 * selectors (metric cards, trend chart) and the "vs previous period" deltas.
 */
export function DateRangeControl() {
  const period = useScenarioStore((s) => s.period);
  const setPeriod = useScenarioStore((s) => s.setPeriod);
  const compare = useScenarioStore((s) => s.compareToPrevious);
  const setCompare = useScenarioStore((s) => s.setCompareToPrevious);
  const meta = periodMeta(period);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5">
          <CalendarRange className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-medium">{meta.label}</span>
          <ChevronDown className="size-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Analysis window</DropdownMenuLabel>
        {PERIODS.map((p) => (
          <DropdownMenuItem key={p.id} onClick={() => setPeriod(p.id)} className="gap-2">
            <span className="flex-1">{p.label}</span>
            {period === p.id && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem disabled className="gap-2 text-xs text-muted-foreground">
          Custom range… (soon)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setCompare(!compare);
          }}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent",
          )}
        >
          <span>Compare to previous period</span>
          <Switch checked={compare} aria-label="Compare to previous period" className="pointer-events-none" />
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
