"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ActorBadge, ACTOR_CONFIG } from "@/components/feedback/actor-badge";
import { EntityLink } from "@/components/records/entity-link";
import { formatRelativeTime } from "@/lib/formatting";
import type { ActivityEvent } from "@/data/schema";

/**
 * Mixed human/agent/system/connector timeline. Human and agent activity share
 * the timeline but stay visually distinguishable via the actor accent rail.
 */
export function ActivityTimeline({
  events,
  className,
  emptyLabel = "No activity yet.",
}: {
  events: ActivityEvent[];
  className?: string;
  emptyLabel?: string;
}) {
  if (events.length === 0) {
    return <div className="px-1 py-6 text-center text-sm text-muted-foreground">{emptyLabel}</div>;
  }
  return (
    <ol className={cn("relative space-y-0", className)}>
      {events.map((e, i) => {
        const accent = ACTOR_CONFIG[e.actorKind].accent;
        return (
          <li key={e.id} className="relative flex gap-3 pb-4 last:pb-0">
            {/* rail */}
            <div className="flex flex-col items-center">
              <span className={cn("mt-1 size-2 rounded-full bg-current", accent)} />
              {i < events.length - 1 && <span className="w-px flex-1 bg-border" />}
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
                <ActorBadge kind={e.actorKind} name={e.actorRef?.label} variant="inline" />
                <span className="text-muted-foreground">{e.action}</span>
                {e.targetRef && <EntityLink entity={e.targetRef} />}
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{e.result}</span>
                <span>·</span>
                <time dateTime={e.at}>{formatRelativeTime(e.at)}</time>
                {e.department && (
                  <>
                    <span>·</span>
                    <span className="capitalize">{e.department.replace("-", " ")}</span>
                  </>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
