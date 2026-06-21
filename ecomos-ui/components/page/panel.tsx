import * as React from "react";
import { cn } from "@/lib/utils";
import { LoadingState, type LoadingShape } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";

/**
 * Panel — the standard content surface (COMPONENT-SYSTEM). Optional header,
 * description, controls slot, body, footer, plus self-contained loading and
 * error states so a single panel can fail/load independently of the page.
 */
export function Panel({
  title,
  description,
  icon: Icon,
  controls,
  footer,
  children,
  loading = false,
  loadingShape = "list",
  error,
  onRetry,
  className,
  bodyClassName,
  as: Comp = "section",
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  /** Right-aligned controls in the header (filters, period, view menu). */
  controls?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  loading?: boolean;
  loadingShape?: LoadingShape;
  /** When set, the body renders an ErrorState instead of children. */
  error?: { title?: string; description?: string; impact?: string } | null;
  onRetry?: () => void;
  className?: string;
  bodyClassName?: string;
  as?: React.ElementType;
}) {
  const hasHeader = title || description || controls || Icon;
  return (
    <Comp className={cn("rounded-xl border bg-card text-card-foreground", className)}>
      {hasHeader && (
        <div className="flex items-start justify-between gap-3 border-b px-4 py-3">
          <div className="flex min-w-0 items-start gap-2">
            {Icon && <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />}
            <div className="min-w-0">
              {title && <h3 className="text-sm font-semibold leading-tight">{title}</h3>}
              {description && (
                <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          {controls && <div className="flex shrink-0 items-center gap-2">{controls}</div>}
        </div>
      )}
      <div className={cn("p-4", bodyClassName)}>
        {loading ? (
          <LoadingState shape={loadingShape} />
        ) : error ? (
          <ErrorState
            compact
            title={error.title}
            description={error.description}
            impact={error.impact}
            onRetry={onRetry}
          />
        ) : (
          children
        )}
      </div>
      {footer && !loading && !error && (
        <div className="border-t px-4 py-2.5 text-sm">{footer}</div>
      )}
    </Comp>
  );
}
