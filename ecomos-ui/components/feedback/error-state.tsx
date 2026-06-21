"use client";

import * as React from "react";
import { AlertOctagon, ChevronDown, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

/**
 * ErrorState: a recoverable failure for a panel or route. Explains WHAT failed,
 * the IMPACT, an optional last-good note, a (simulated) retry, and a disclosure
 * for technical details. Keep the rest of the page usable around it.
 */
export function ErrorState({
  title = "Couldn't load this",
  description,
  impact,
  lastGoodNote,
  onRetry,
  retryLabel = "Retry",
  technicalDetails,
  className,
  compact = false,
}: {
  title?: React.ReactNode;
  /** What failed, in plain language. */
  description?: React.ReactNode;
  /** What the failure means for the user / page. */
  impact?: React.ReactNode;
  /** Note that last-good data is still shown elsewhere. */
  lastGoodNote?: React.ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  /** Raw error text for the disclosure. */
  technicalDetails?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-center",
        compact ? "py-8" : "py-12",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-critical-surface">
        <AlertOctagon className="size-6 text-critical" aria-hidden />
      </div>
      <div className="space-y-1">
        <p className="text-base font-medium">{title}</p>
        {description && (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
        {impact && (
          <p className="mx-auto max-w-sm text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Impact: </span>
            {impact}
          </p>
        )}
        {lastGoodNote && (
          <p className="mx-auto max-w-sm text-xs text-warning">{lastGoodNote}</p>
        )}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={onRetry}>
          <RotateCw className="size-3.5" />
          {retryLabel}
        </Button>
      )}
      {technicalDetails && (
        <Collapsible className="w-full max-w-md">
          <CollapsibleTrigger className="mx-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground [&[data-state=open]>svg]:rotate-180">
            Technical details
            <ChevronDown className="size-3.5 transition-transform" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <pre className="mt-2 max-h-40 overflow-auto rounded-md bg-muted p-2 text-left font-mono text-[11px] text-muted-foreground">
              {technicalDetails}
            </pre>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
