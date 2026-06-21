"use client";

import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type PageHeaderTab = { value: string; label: string; count?: number };

export type PageHeaderAction = {
  label: string;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "default" | "outline" | "secondary" | "ghost";
  disabled?: boolean;
  disabledReason?: string;
};

/**
 * The single page-heading contract used by every route.
 * Eyebrow, title, one-line purpose, freshness/context metadata, a primary
 * action, secondary actions, an overflow menu, and optional tabs.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  primaryAction,
  secondaryActions,
  overflowActions,
  tabs,
  activeTab,
  onTabChange,
  className,
  children,
}: {
  eyebrow?: React.ReactNode;
  title: string;
  description?: string;
  /** Freshness / scope line (store · period · updated). */
  meta?: React.ReactNode;
  primaryAction?: PageHeaderAction;
  secondaryActions?: PageHeaderAction[];
  overflowActions?: PageHeaderAction[];
  tabs?: PageHeaderTab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("border-b bg-background px-4 pt-4 sm:px-6", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {eyebrow}
            </div>
          )}
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
          {description && (
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
          )}
          {meta && (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {meta}
            </div>
          )}
        </div>

        {(primaryAction || secondaryActions?.length || overflowActions?.length) && (
          <div className="flex shrink-0 items-center gap-2">
            {secondaryActions?.map((a) => (
              <ActionButton key={a.label} action={a} fallbackVariant="outline" />
            ))}
            {primaryAction && <ActionButton action={primaryAction} fallbackVariant="default" />}
            {overflowActions && overflowActions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="size-8" aria-label="More actions">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {overflowActions.map((a) => (
                    <DropdownMenuItem key={a.label} onClick={a.onClick} disabled={a.disabled}>
                      {a.icon && <a.icon className="size-4" />}
                      {a.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>

      {children && <div className="mt-3">{children}</div>}

      {tabs && tabs.length > 0 && (
        <div className="mt-3 flex items-center gap-1 overflow-x-auto">
          {tabs.map((t) => {
            const active = t.value === activeTab;
            return (
              <button
                key={t.value}
                onClick={() => onTabChange?.(t.value)}
                className={cn(
                  "relative whitespace-nowrap px-3 py-2 text-sm transition-colors",
                  active ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
                {typeof t.count === "number" && (
                  <span className="ml-1.5 rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    {t.count}
                  </span>
                )}
                {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ActionButton({
  action,
  fallbackVariant,
}: {
  action: PageHeaderAction;
  fallbackVariant: PageHeaderAction["variant"];
}) {
  const Icon = action.icon;
  return (
    <Button
      variant={action.variant ?? fallbackVariant}
      size="sm"
      className="h-8 gap-1.5"
      onClick={action.onClick}
      disabled={action.disabled}
      title={action.disabled ? action.disabledReason : undefined}
    >
      {Icon && <Icon className="size-3.5" />}
      <span>{action.label}</span>
    </Button>
  );
}
