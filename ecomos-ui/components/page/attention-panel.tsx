"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/feedback/status";
import { ActorBadge } from "@/components/feedback/actor-badge";
import type { ActorKind, StatusVariant } from "@/data/schema";

export type AttentionRow = {
  id: string;
  title: string;
  detail?: string;
  severity: StatusVariant;
  actorKind?: ActorKind;
  href?: string;
};

/**
 * Higher-priority panel for exceptions and decisions. Attention before
 * information (DESIGN-PRINCIPLES 2). Severity is shown with text + icon, never
 * color alone; rows are actionable links.
 */
export function AttentionPanel({
  title = "Needs attention",
  rows,
  emptyLabel = "Nothing needs attention right now.",
  className,
}: {
  title?: string;
  rows: AttentionRow[];
  emptyLabel?: string;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col rounded-lg border bg-card", className)}>
      <header className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-medium">
          <TriangleAlert className="size-4 text-warning" />
          {title}
        </h2>
        {rows.length > 0 && <span className="text-xs text-muted-foreground">{rows.length}</span>}
      </header>
      {rows.length === 0 ? (
        <div className="px-4 py-6 text-center text-sm text-muted-foreground">{emptyLabel}</div>
      ) : (
        <ul className="divide-y">
          {rows.map((r) => {
            const Inner = (
              <div className="flex items-start gap-3 px-4 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge variant={r.severity} size="xs" showIcon={false} />
                    <span className="truncate text-sm font-medium">{r.title}</span>
                  </div>
                  {r.detail && <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{r.detail}</p>}
                  {r.actorKind && (
                    <div className="mt-1">
                      <ActorBadge kind={r.actorKind} variant="inline" className="text-[11px] text-muted-foreground" />
                    </div>
                  )}
                </div>
                {r.href && <ArrowRight className="mt-1 size-3.5 shrink-0 text-muted-foreground" />}
              </div>
            );
            return (
              <li key={r.id}>
                {r.href ? (
                  <Link href={r.href} className="block transition-colors hover:bg-accent/50">
                    {Inner}
                  </Link>
                ) : (
                  Inner
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
