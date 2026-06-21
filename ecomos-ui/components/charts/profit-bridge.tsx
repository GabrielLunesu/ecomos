"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatting";
import type { CurrencyCode, ProfitBridgeStep } from "@/data/schema";

/**
 * Profit-bridge / waterfall as a horizontal stepped bar list. Reads clearly in
 * dense layouts and both themes without relying on color alone (each row is
 * labelled and signed). Start/total are neutral; decreases use the critical
 * tone, increases the success tone.
 */
export function ProfitBridge({
  steps,
  currency = "EUR",
  className,
}: {
  steps: ProfitBridgeStep[];
  currency?: CurrencyCode;
  className?: string;
}) {
  const max = Math.max(...steps.map((s) => Math.abs(s.amount)), 1);

  return (
    <div className={cn("space-y-1.5", className)}>
      {steps.map((s) => {
        const pct = (Math.abs(s.amount) / max) * 100;
        const tone =
          s.kind === "total" || s.kind === "start"
            ? "bg-primary"
            : s.kind === "increase"
              ? "bg-success"
              : "bg-critical";
        const emphatic = s.kind === "total" || s.kind === "start";
        return (
          <div key={s.key} className="flex items-center gap-3">
            <div className={cn("w-36 shrink-0 truncate text-xs", emphatic ? "font-medium" : "text-muted-foreground")}>
              {s.label}
            </div>
            <div className="relative h-5 flex-1 rounded bg-muted/50">
              <div className={cn("absolute inset-y-0 left-0 rounded", tone)} style={{ width: `${pct}%` }} />
            </div>
            <div className={cn("w-28 shrink-0 text-right text-xs tabular-nums", emphatic ? "font-semibold" : "")}>
              {formatCurrency(s.amount, currency, { compact: true })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
