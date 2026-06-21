"use client";

import * as React from "react";
import { PageBody } from "@/components/page/page-body";
import { Panel } from "@/components/page/panel";
import { AttentionPanel } from "@/components/page/attention-panel";
import { RankedList } from "@/components/page/ranked-list";
import { MetricStrip } from "@/components/metrics/metric-strip";
import { TimeSeriesChart } from "@/components/charts/time-series-chart";
import { ActivityTimeline } from "@/components/trace/activity-timeline";
import { EmptyState } from "@/components/feedback/empty-state";
import { StatusBadge } from "@/components/feedback/status";
import { useScenarioStore } from "@/data/scenario-store";
import { selectCommandCenter } from "@/data/selectors/command-center";
import { useRouter } from "next/navigation";

export default function CommandCenterPage() {
  const scenario = useScenarioStore((s) => s.scenario);
  const period = useScenarioStore((s) => s.period);
  const compare = useScenarioStore((s) => s.compareToPrevious);
  const router = useRouter();
  const data = React.useMemo(
    () => selectCommandCenter(scenario, "all", period, compare),
    [scenario, period, compare],
  );

  return (
    <PageBody className="space-y-5">
        {data.isEmpty ? (
          <EmptyState
            variant="first-use"
            title="No activity yet"
            description="Connect a store and channels to populate the Command Center. You can explore every surface now with demo data using the scenario switcher."
          />
        ) : (
          <>
            {/* Business pulse */}
            <MetricStrip
              columns={5}
              items={data.pulse.map((m) => ({
                id: m.key,
                label: m.label,
                value: m.value,
                format: m.format === "currency" ? "currency" : m.format === "percent" ? "percent" : m.format === "number" ? "number" : "currency",
                currency: m.currency,
                trend: m.trend,
                invertTrend: m.invertTrend,
                confidence: m.confidence,
                onDrillDown: () => router.push(m.href),
              }))}
            />

            {/* Trend workspace — directly below the KPI grid */}
            <Panel
              title="Revenue, margin & spend"
              description="Daily series across the selected period · semantic series"
            >
              <TimeSeriesChart
                data={data.series}
                series={[
                  { key: "revenue", label: "Revenue", color: "var(--color-chart-1)" },
                  { key: "margin", label: "Contribution margin", color: "var(--color-chart-2)" },
                  { key: "spend", label: "Ad spend", color: "var(--color-chart-3)" },
                ]}
              />
            </Panel>

            <div className="grid gap-5 lg:grid-cols-3">
              {/* Attention queue takes priority and width */}
              <AttentionPanel className="lg:col-span-2" rows={data.attention} />

              {/* Department summaries */}
              <Panel title="Departments">
                <div className="space-y-2.5">
                  {data.departments.map((d) => (
                    <button
                      key={d.key}
                      onClick={() => router.push(d.href)}
                      className="flex w-full items-start justify-between gap-2 rounded-md border bg-background px-3 py-2 text-left transition-colors hover:bg-accent"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium">{d.label}</div>
                        <div className="truncate text-xs text-muted-foreground">{d.headline}</div>
                      </div>
                      <StatusBadge variant={d.status} size="xs" showIcon={false} />
                    </button>
                  ))}
                </div>
              </Panel>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <Panel title="Recent activity" className="lg:col-span-2">
                <ActivityTimeline events={data.recentActivity} />
              </Panel>
              <Panel title="Today's priorities">
                <RankedList
                  rows={data.priorities.map((p) => ({ id: p.id, label: p.title, href: p.href }))}
                />
              </Panel>
            </div>
          </>
        )}
    </PageBody>
  );
}
