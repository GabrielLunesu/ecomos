"use client";

import * as React from "react";
import { PageBody } from "@/components/page/page-body";
import { Panel } from "@/components/page/panel";
import { AttentionPanel } from "@/components/page/attention-panel";
import { RankedList } from "@/components/page/ranked-list";
import { MetricStrip } from "@/components/metrics/metric-strip";
import { EmptyState } from "@/components/feedback/empty-state";
import { useScenarioStore } from "@/data/scenario-store";
import { selectCsOverview } from "@/data/selectors/customer-service";
import { titleCase } from "@/lib/formatting";

export default function CustomerServicePage() {
  const scenario = useScenarioStore((s) => s.scenario);
  const d = React.useMemo(() => selectCsOverview(scenario, "all"), [scenario]);
  const maxTopic = Math.max(...d.topics.map((t) => t.count), 1);

  return (
    <PageBody className="space-y-5">
        {d.isEmpty ? (
          <EmptyState variant="first-use" title="No tickets yet" description="Connect a support inbox to populate customer service." />
        ) : (
          <>
            <MetricStrip
              columns={6}
              items={[
                { id: "open", label: "Open tickets", value: d.open, format: "number" },
                { id: "auto", label: "Automation rate", value: d.automationRatePct, format: "percent" },
                { id: "frt", label: "Avg first response (min)", value: d.avgFirstResponseMins, format: "number" },
                { id: "res", label: "Avg resolution (h)", value: d.avgResolutionHours, format: "number" },
                { id: "reopen", label: "Reopen rate", value: d.reopenRatePct, format: "percent", invertTrend: true },
                { id: "neg", label: "Negative sentiment", value: d.negativeSentimentPct, format: "percent" },
              ]}
            />

            <div className="grid gap-5 lg:grid-cols-3">
              <AttentionPanel
                className="lg:col-span-2"
                title="Risky & poor outcomes"
                rows={d.riskItems.map((r) => ({ id: r.id, title: r.subject, detail: r.reason, severity: r.severity, href: r.href }))}
                emptyLabel="No risky outcomes in this period."
              />
              <Panel title="Attention summary">
                <RankedList
                  rows={[
                    { id: "esc", label: "Escalations", valueText: String(d.escalations), status: d.escalations > 0 ? "warning" : "success", statusLabel: d.escalations > 0 ? "Review" : "OK" },
                    { id: "ovd", label: "Overdue (SLA)", valueText: String(d.overdue), status: d.overdue > 0 ? "warning" : "success", statusLabel: d.overdue > 0 ? "Review" : "OK" },
                    { id: "fail", label: "Failed sends", valueText: String(d.failedSends), status: d.failedSends > 0 ? "critical" : "success", statusLabel: d.failedSends > 0 ? "Fix" : "OK", href: "/customer-service/tickets" },
                    { id: "appr", label: "Pending approvals", valueText: String(d.pendingApprovals), status: d.pendingApprovals > 0 ? "awaiting-approval" : "success", statusLabel: d.pendingApprovals > 0 ? "Decide" : "OK", href: "/customer-service/approvals" },
                  ]}
                />
              </Panel>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <Panel title="Issue topics" description="Distribution across the ticket dataset">
                <div className="space-y-2">
                  {d.topics.map((t) => (
                    <div key={t.topic} className="flex items-center gap-3">
                      <span className="w-32 shrink-0 truncate text-xs text-muted-foreground">{titleCase(t.topic)}</span>
                      <div className="h-4 flex-1 rounded bg-muted/50">
                        <div className="h-full rounded bg-chart-1" style={{ width: `${(t.count / maxTopic) * 100}%`, backgroundColor: "var(--color-chart-1)" }} />
                      </div>
                      <span className="w-8 shrink-0 text-right text-xs tabular-nums">{t.count}</span>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel title="Workload" description="Open tickets by owner (people and agents)">
                <RankedList
                  rows={d.workload.map((w, i) => ({
                    id: `${w.ownerLabel}-${i}`,
                    label: w.ownerLabel,
                    sublabel: w.isAgent ? "Agent" : "Person",
                    valueText: `${w.open} open`,
                    status: w.isAgent ? "info" : "neutral",
                    statusLabel: w.isAgent ? "Agent" : undefined,
                  }))}
                />
              </Panel>
            </div>
          </>
        )}
    </PageBody>
  );
}
