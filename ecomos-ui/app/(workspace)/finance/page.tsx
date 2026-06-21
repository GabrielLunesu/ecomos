"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Download, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageBody } from "@/components/page/page-body";
import { Panel } from "@/components/page/panel";
import { SourceHealthPanel } from "@/components/page/source-health-panel";
import { RankedList } from "@/components/page/ranked-list";
import { MetricStrip } from "@/components/metrics/metric-strip";
import { MetricSummary } from "@/components/metrics/metric-summary";
import { TimeSeriesChart } from "@/components/charts/time-series-chart";
import { ProfitBridge } from "@/components/charts/profit-bridge";
import { EmptyState } from "@/components/feedback/empty-state";
import { useScenarioStore } from "@/data/scenario-store";
import { selectFinanceOverview } from "@/data/selectors/finance";
import { getScenarioData } from "@/data/scenarios";
import { formatCurrency } from "@/lib/formatting";

export default function FinancePage() {
  const scenario = useScenarioStore((s) => s.scenario);
  const period = useScenarioStore((s) => s.period);
  const compare = useScenarioStore((s) => s.compareToPrevious);
  const router = useRouter();

  const data = React.useMemo(
    () => selectFinanceOverview(scenario, "all", period, compare),
    [scenario, period, compare],
  );
  const sources = React.useMemo(() => getScenarioData(scenario).sources.filter((s) => s.kind !== "communication"), [scenario]);
  const b = data.breakdown;

  return (
    <PageBody className="space-y-5">
        {data.isEmpty ? (
          <EmptyState variant="first-use" title="No finance data yet" description="Connect commerce, ads and payment sources to compute contribution margin." />
        ) : (
          <>
            <div className="grid gap-5 lg:grid-cols-3">
              <Panel
                title="Estimated contribution margin"
                className="lg:col-span-2"
                description="net revenue − COGS − ad spend − fees − shipping − refunds"
                controls={
                  <Button variant="outline" size="sm" className="h-7 gap-1.5">
                    <Download className="size-3.5" /> Export
                  </Button>
                }
              >
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <MetricSummary
                    label="Estimated contribution margin"
                    value={b.estimatedContributionMargin}
                    format="currency"
                    currency={data.currency}
                    size="lg"
                    trend={data.marginTrend}
                    confidence={b.confidence}
                    status={b.confidence === "partial" ? "warning" : undefined}
                    statusLabel={b.confidence === "partial" ? "Partial" : undefined}
                  />
                  {data.marginRatePct !== null && (
                    <MetricSummary label="Margin rate" value={data.marginRatePct} format="percent" size="md" />
                  )}
                </div>
                {b.missingInputs.length > 0 && (
                  <div className="mt-3 flex items-start gap-2 rounded-md bg-warning-surface px-3 py-2 text-xs text-warning-foreground">
                    <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
                    <span>Missing or estimated inputs: {b.missingInputs.join(" · ")}</span>
                  </div>
                )}
                <div className="mt-4">
                  <ProfitBridge steps={data.bridge} currency={data.currency} />
                </div>
              </Panel>

              <Panel title="Source health" description="Freshness of the inputs behind the number">
                <SourceHealthPanel sources={sources} />
                {data.warnings.length > 0 && (
                  <div className="mt-3 space-y-1.5 border-t pt-3">
                    {data.warnings.map((w) => (
                      <button key={w.id} onClick={() => router.push(w.href)} className="flex w-full items-center gap-2 text-left text-xs text-warning-foreground hover:underline">
                        <TriangleAlert className="size-3.5 text-warning" /> {w.label}
                      </button>
                    ))}
                  </div>
                )}
              </Panel>
            </div>

            <MetricStrip
              columns={6}
              items={[
                { id: "rev", label: "Net revenue", value: b.netRevenue, format: "currency", currency: data.currency },
                { id: "cogs", label: "COGS", value: b.cogs, format: "currency", currency: data.currency, status: b.cogs === null ? "warning" : undefined, statusLabel: b.cogs === null ? "Missing" : undefined },
                { id: "spend", label: "Ad spend", value: b.allocatedAdSpend, format: "currency", currency: data.currency },
                { id: "fees", label: "Fees", value: b.fees, format: "currency", currency: data.currency },
                { id: "ship", label: "Shipping", value: b.shippingCost, format: "currency", currency: data.currency },
                { id: "ref", label: "Refunds", value: b.refunds, format: "currency", currency: data.currency },
              ]}
            />

            <Panel title="Contribution margin trend" description="Daily margin vs revenue and spend">
              <TimeSeriesChart
                data={data.series}
                series={[
                  { key: "margin", label: "Contribution margin", color: "var(--color-chart-2)" },
                  { key: "revenue", label: "Revenue", color: "var(--color-chart-1)" },
                  { key: "spend", label: "Ad spend", color: "var(--color-chart-3)" },
                ]}
              />
            </Panel>

            <div className="grid gap-5 lg:grid-cols-2">
              <Panel title="Largest positive drivers">
                <RankedList rows={data.positiveDrivers.map((d) => ({ id: d.id, label: d.label, valueText: formatCurrency(d.amount, data.currency, { compact: true }), href: d.href, status: "success", statusLabel: "+" }))} />
              </Panel>
              <Panel title="Largest negative drivers">
                <RankedList rows={data.negativeDrivers.map((d) => ({ id: d.id, label: d.label, valueText: formatCurrency(d.amount, data.currency, { compact: true }), href: d.href, status: "critical", statusLabel: "−" }))} />
              </Panel>
            </div>
          </>
        )}
    </PageBody>
  );
}
