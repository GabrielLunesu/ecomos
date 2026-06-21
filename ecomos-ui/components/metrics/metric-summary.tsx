"use client";

import * as React from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatCompact,
  formatCurrency,
  formatMultiplier,
  formatNumber,
  formatPercent,
} from "@/lib/formatting";
import { FreshnessIndicator } from "@/components/feedback/freshness-indicator";
import { StatusBadge } from "@/components/feedback/status";
import {
  MetricExplanation,
  type MetricExplanationData,
} from "@/components/metrics/metric-explanation";
import type {
  Confidence,
  CurrencyCode,
  Freshness,
  StatusVariant,
  Trend,
  TrendDirection,
} from "@/data/schema";

/**
 * The supported numeric formats. Values stay NUMERIC in props; we format here
 * with lib/formatting so the canonical fixture value is never a display string.
 */
export type MetricFormat =
  | "currency"
  | "currency-compact"
  | "number"
  | "compact"
  | "percent"
  | "percent-ratio"
  | "multiplier";

export function formatMetricValue(
  value: number | null | undefined,
  format: MetricFormat,
  currency: CurrencyCode = "EUR",
): string {
  switch (format) {
    case "currency":
      return formatCurrency(value, currency);
    case "currency-compact":
      return formatCurrency(value, currency, { compact: true });
    case "number":
      return formatNumber(value);
    case "compact":
      return formatCompact(value);
    case "percent":
      return formatPercent(value);
    case "percent-ratio":
      return formatPercent(value, { fromRatio: true });
    case "multiplier":
      return formatMultiplier(value);
  }
}

const CONFIDENCE_LABEL: Record<Confidence, string> = {
  confirmed: "Confirmed",
  estimated: "Estimated",
  partial: "Partial",
  missing: "Missing inputs",
};

/**
 * MetricSummary — a primary value with comparison, data status, and a drill-down
 * path. It is NOT always a card (COMPONENT-SYSTEM); pass `as="div"` for inline
 * use in strips. Comparison direction uses semantic success/critical with an
 * icon AND a sign — never color alone (DESIGN-PRINCIPLES 4).
 */
export function MetricSummary({
  label,
  value,
  format,
  currency = "EUR",
  period,
  trend,
  /** When true, a downward trend is GOOD (e.g. refunds, cost). Flips color. */
  invertTrend = false,
  comparisonLabel = "vs prev. period",
  status,
  statusLabel,
  confidence,
  freshness,
  explanation,
  onDrillDown,
  size = "md",
  className,
  as: Comp = "div",
}: {
  label: React.ReactNode;
  value: number | null | undefined;
  format: MetricFormat;
  currency?: CurrencyCode;
  period?: React.ReactNode;
  trend?: Trend | null;
  invertTrend?: boolean;
  comparisonLabel?: React.ReactNode;
  status?: StatusVariant;
  statusLabel?: string;
  confidence?: Confidence;
  freshness?: Freshness;
  explanation?: MetricExplanationData;
  onDrillDown?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  as?: React.ElementType;
}) {
  const valueText = formatMetricValue(value, format, currency);
  const interactive = Boolean(onDrillDown);

  return (
    <Comp
      className={cn("group min-w-0", className)}
      {...(interactive
        ? {
            role: "button",
            tabIndex: 0,
            onClick: onDrillDown,
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onDrillDown?.();
              }
            },
          }
        : {})}
    >
      <div className="flex items-center gap-1.5">
        <span className="truncate text-xs font-medium text-muted-foreground">{label}</span>
        {explanation && <MetricExplanation label={typeof label === "string" ? label : "Metric"} data={explanation} />}
        {status && <StatusBadge variant={status} label={statusLabel} size="xs" />}
      </div>

      <div
        className={cn(
          "mt-0.5 font-semibold tabular-nums tracking-tight",
          size === "sm" && "text-lg",
          size === "md" && "text-2xl",
          size === "lg" && "text-3xl",
          interactive && "group-hover:underline group-hover:underline-offset-4",
        )}
      >
        {valueText}
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        {trend && <TrendBadge trend={trend} invert={invertTrend} />}
        {trend && comparisonLabel && (
          <span className="text-muted-foreground">{comparisonLabel}</span>
        )}
        {confidence && confidence !== "confirmed" && (
          <span className="text-muted-foreground">· {CONFIDENCE_LABEL[confidence]}</span>
        )}
        {period && <span className="text-muted-foreground">· {period}</span>}
      </div>

      {freshness && (
        <div className="mt-1">
          <FreshnessIndicator freshness={freshness} />
        </div>
      )}
    </Comp>
  );
}

const DIRECTION_ICON: Record<TrendDirection, React.ComponentType<{ className?: string }>> = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: ArrowRight,
};

/** Comparison indicator: icon + signed percent + semantic color. */
export function TrendBadge({
  trend,
  invert = false,
  className,
}: {
  trend: Trend;
  invert?: boolean;
  className?: string;
}) {
  const Icon = DIRECTION_ICON[trend.direction];
  // Determine "good vs bad" semantics; flat is neutral.
  const positive = trend.direction === "up";
  const good = trend.direction === "flat" ? null : invert ? !positive : positive;
  const accent =
    good === null
      ? "text-muted-foreground"
      : good
        ? "text-success"
        : "text-critical";

  return (
    <span className={cn("inline-flex items-center gap-0.5 font-medium tabular-nums", accent, className)}>
      <Icon className="size-3.5 shrink-0" aria-hidden />
      <span>{trend.deltaPct === null ? "—" : formatPercent(trend.deltaPct, { signed: true })}</span>
    </span>
  );
}
