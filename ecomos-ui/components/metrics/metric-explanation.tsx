"use client";

import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FreshnessIndicator } from "@/components/feedback/freshness-indicator";
import type { Freshness } from "@/data/schema";

export type MetricExplanationData = {
  /** Plain-language formula, e.g. "Revenue − COGS − Ad spend". */
  formula?: string;
  /** Components included in the calculation. */
  included?: string[];
  /** Components deliberately excluded. */
  excluded?: string[];
  /** Where the inputs come from. */
  sources?: string[];
  /** Freshness of the underlying inputs. */
  freshness?: Freshness;
  /** Caveats, estimation notes, missing inputs. */
  caveats?: string[];
};

/**
 * MetricExplanation — a popover (or inline block) explaining how a metric is
 * computed: formula, included/excluded components, sources, freshness, caveats.
 * Satisfies "every summary can be investigated": a number with no provenance is
 * decoration (DESIGN-PRINCIPLES 6).
 */
export function MetricExplanation({
  label,
  data,
  trigger,
  className,
}: {
  /** Metric label for the popover heading. */
  label: string;
  data: MetricExplanationData;
  /** Custom trigger; defaults to a small info button. */
  trigger?: React.ReactNode;
  className?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger ?? (
          <button
            type="button"
            aria-label={`How ${label} is calculated`}
            className="inline-flex size-4 items-center justify-center rounded text-muted-foreground hover:text-foreground"
          >
            <Info className="size-3.5" />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className={cn("w-80 p-0 text-sm", className)}>
        <MetricExplanationBody label={label} data={data} />
      </PopoverContent>
    </Popover>
  );
}

/** The explanation content without the popover — reuse inside drawers. */
export function MetricExplanationBody({
  label,
  data,
}: {
  label: string;
  data: MetricExplanationData;
}) {
  return (
    <div className="space-y-3 p-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          How this is calculated
        </p>
        <p className="mt-0.5 font-medium">{label}</p>
      </div>
      {data.formula && (
        <p className="rounded-md bg-muted px-2 py-1.5 font-mono text-xs">{data.formula}</p>
      )}
      {data.included && data.included.length > 0 && (
        <ExplanationList title="Included" items={data.included} accent="text-success" />
      )}
      {data.excluded && data.excluded.length > 0 && (
        <ExplanationList title="Excluded" items={data.excluded} accent="text-muted-foreground" />
      )}
      {data.sources && data.sources.length > 0 && (
        <ExplanationList title="Sources" items={data.sources} accent="text-info" />
      )}
      {data.caveats && data.caveats.length > 0 && (
        <ExplanationList title="Caveats" items={data.caveats} accent="text-warning" />
      )}
      {data.freshness && (
        <div className="border-t pt-2">
          <FreshnessIndicator freshness={data.freshness} />
        </div>
      )}
    </div>
  );
}

function ExplanationList({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <ul className="mt-1 space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-1.5 text-xs">
            <span className={cn("mt-1.5 size-1 shrink-0 rounded-full bg-current", accent)} aria-hidden />
            <span className="text-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
