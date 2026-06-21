"use client";

import * as React from "react";
import { PageBody } from "@/components/page/page-body";
import { Panel } from "@/components/page/panel";
import { ActivityTimeline } from "@/components/trace/activity-timeline";
import { TraceTimeline } from "@/components/trace/trace-timeline";
import { EmptyState } from "@/components/feedback/empty-state";
import { ACTOR_CONFIG } from "@/components/feedback/actor-badge";
import { cn } from "@/lib/utils";
import { useScenarioStore } from "@/data/scenario-store";
import { selectActivityTimeline } from "@/data/selectors/activity";
import { getTrace } from "@/data/base/traces";
import type { ActorKind } from "@/data/schema";

const ACTOR_KINDS: ActorKind[] = ["human", "agent", "system", "connector", "approval"];

export default function ActivityPage() {
  const scenario = useScenarioStore((s) => s.scenario);
  const [active, setActive] = React.useState<ActorKind[]>([]);

  const data = React.useMemo(
    () => selectActivityTimeline(scenario, "all", { actorKinds: active }),
    [scenario, active],
  );
  const featuredTrace = getTrace("TR-ops-incident") ?? getTrace("TR-wismo-success");

  const toggle = (k: ActorKind) =>
    setActive((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  return (
    <PageBody className="space-y-5">
        {/* Actor filter chips */}
        <div className="flex flex-wrap items-center gap-2">
          {ACTOR_KINDS.map((k) => {
            const on = active.includes(k);
            return (
              <button
                key={k}
                onClick={() => toggle(k)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors",
                  on ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent",
                )}
              >
                <span className={cn("size-2 rounded-full bg-current", on ? "" : ACTOR_CONFIG[k].accent)} />
                <span className="capitalize">{k}</span>
                <span className={cn("tabular-nums", on ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {data.countsByActor[k]}
                </span>
              </button>
            );
          })}
          {active.length > 0 && (
            <button onClick={() => setActive([])} className="text-xs text-muted-foreground hover:text-foreground">
              Reset
            </button>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <Panel title="Event timeline" className="lg:col-span-2" description={`${data.events.length} of ${data.total} events`}>
            {data.isEmpty ? (
              <EmptyState variant="zero-activity" compact />
            ) : data.events.length === 0 ? (
              <EmptyState variant="no-results" compact secondary={<button className="text-xs underline" onClick={() => setActive([])}>Reset filters</button>} />
            ) : (
              <ActivityTimeline events={data.events} />
            )}
          </Panel>

          <Panel title="Featured agent trace" description={featuredTrace?.runId}>
            {featuredTrace ? (
              <TraceTimeline trace={featuredTrace} />
            ) : (
              <EmptyState variant="zero-activity" compact />
            )}
          </Panel>
        </div>
    </PageBody>
  );
}
