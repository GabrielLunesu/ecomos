import * as React from "react";
import { cn } from "@/lib/utils";
import { MetricSummary } from "@/components/metrics/metric-summary";
import type { MetricFormat } from "@/components/metrics/metric-summary";
import type { MetricExplanationData } from "@/components/metrics/metric-explanation";
import type {
  Confidence,
  CurrencyCode,
  Freshness,
  StatusVariant,
  Trend,
} from "@/data/schema";

export type MetricStripItem = {
  id: string;
  label: React.ReactNode;
  value: number | null | undefined;
  format: MetricFormat;
  currency?: CurrencyCode;
  trend?: Trend | null;
  invertTrend?: boolean;
  status?: StatusVariant;
  statusLabel?: string;
  confidence?: Confidence;
  freshness?: Freshness;
  explanation?: MetricExplanationData;
  onDrillDown?: () => void;
};

/**
 * MetricStrip — a compact row of related values for page summaries and drawers.
 * Avoids decorative KPI cards (DESIGN-PRINCIPLES anti-patterns): items share a
 * single bordered surface separated by hairlines, not four floating boxes.
 */
export function MetricStrip({
  items,
  size = "sm",
  className,
  columns,
}: {
  items: MetricStripItem[];
  size?: "sm" | "md";
  /** Force a fixed column count; defaults to responsive auto-fit. */
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid divide-y divide-border rounded-xl border bg-card sm:divide-x sm:divide-y-0",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
        columns === 5 && "sm:grid-cols-3 lg:grid-cols-5",
        columns === 6 && "sm:grid-cols-3 lg:grid-cols-6",
        !columns && "sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {items.map((item) => (
        <MetricSummary
          key={item.id}
          className="px-4 py-3"
          size={size}
          label={item.label}
          value={item.value}
          format={item.format}
          currency={item.currency}
          trend={item.trend}
          invertTrend={item.invertTrend}
          status={item.status}
          statusLabel={item.statusLabel}
          confidence={item.confidence}
          freshness={item.freshness}
          explanation={item.explanation}
          onDrillDown={item.onDrillDown}
        />
      ))}
    </div>
  );
}
