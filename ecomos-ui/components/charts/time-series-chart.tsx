"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCompact, formatShortDate } from "@/lib/formatting";
import { cn } from "@/lib/utils";

export type Series = { key: string; label: string; color: string };

/**
 * Semantic multi-series time chart. Series have explicit ids+labels+colors
 * (no line1/line2), a shared tooltip, light/dark parity via CSS-var colors,
 * and reduced tick density. Includes an empty state.
 */
export function TimeSeriesChart<T extends { date: string }>({
  data,
  series,
  className,
  height = 240,
}: {
  data: T[];
  series: Series[];
  className?: string;
  height?: number;
}) {
  const config: ChartConfig = Object.fromEntries(
    series.map((s) => [s.key, { label: s.label, color: s.color }]),
  );

  if (data.length === 0) {
    return (
      <div
        className={cn("flex items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground", className)}
        style={{ height }}
      >
        No data for this period.
      </div>
    );
  }

  return (
    <ChartContainer config={config} className={cn("w-full", className)} style={{ height }}>
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={s.color} stopOpacity={0.28} />
              <stop offset="95%" stopColor={s.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          minTickGap={48}
          tickFormatter={(v: string) => formatShortDate(v)}
          className="text-[11px]"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={44}
          tickFormatter={(v: number) => formatCompact(v)}
          className="text-[11px]"
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(label) => formatShortDate(String(label))}
              indicator="dot"
            />
          }
        />
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            fill={`url(#fill-${s.key})`}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}
