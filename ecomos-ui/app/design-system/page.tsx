"use client";

import * as React from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { StatusBadge, STATUS_CONFIG } from "@/components/feedback/status";
import { ActorBadge } from "@/components/feedback/actor-badge";
import { FreshnessIndicator } from "@/components/feedback/freshness-indicator";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { StateBanner } from "@/components/feedback/state-banner";
import { InlineMessage } from "@/components/feedback/inline-message";
import { SimulationBadge } from "@/components/feedback/simulation-badge";

import { MetricStrip } from "@/components/metrics/metric-strip";
import { TimeSeriesChart } from "@/components/charts/time-series-chart";
import { ProfitBridge } from "@/components/charts/profit-bridge";
import { Panel } from "@/components/page/panel";
import { AttentionPanel } from "@/components/page/attention-panel";
import { RankedList } from "@/components/page/ranked-list";
import { SourceHealthPanel } from "@/components/page/source-health-panel";
import { DataTable } from "@/components/data-table/data-table";
import { EntityLink } from "@/components/records/entity-link";
import { ActivityTimeline } from "@/components/trace/activity-timeline";
import { TraceTimeline } from "@/components/trace/trace-timeline";
import { ApprovalCard } from "@/components/trace/approval-card";
import { ConfirmActionDialog } from "@/components/forms/confirm-action-dialog";

import type { StatusVariant, ActorKind, Trace, Approval, ActivityEvent } from "@/data/schema";

const STATUS_VARIANTS = Object.keys(STATUS_CONFIG) as StatusVariant[];
const ACTOR_KINDS: ActorKind[] = ["human", "agent", "system", "connector", "approval"];

const SERIES = Array.from({ length: 14 }, (_, i) => ({
  date: `2026-06-${String(7 + i).padStart(2, "0")}`,
  revenue: 4000 + i * 180 + (i % 3) * 220,
  margin: 1200 + i * 60,
  spend: 1400 + (i % 4) * 120,
}));

const BRIDGE = [
  { key: "rev", label: "Net revenue", amount: 18420, kind: "start" as const },
  { key: "cogs", label: "COGS", amount: -7200, kind: "decrease" as const },
  { key: "spend", label: "Ad spend", amount: -4360, kind: "decrease" as const },
  { key: "fees", label: "Fees", amount: -820, kind: "decrease" as const },
  { key: "cm", label: "Contribution margin", amount: 6040, kind: "total" as const },
];

type Row = { id: string; customer: string; total: number; status: StatusVariant };
const ROWS: Row[] = [
  { id: "ORD-1042", customer: "Anna de Vries", total: 248, status: "success" },
  { id: "ORD-1188", customer: "Marek Novák", total: 64, status: "critical" },
  { id: "ORD-1301", customer: "Sofia Rossi", total: 132, status: "warning" },
  { id: "ORD-1207", customer: "Liam Walsh", total: 96, status: "in-progress" },
];
const COLS: ColumnDef<Row, unknown>[] = [
  { accessorKey: "id", header: "Order" },
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "total", header: "Total", cell: (c) => <span className="tabular-nums">€{c.getValue<number>().toFixed(2)}</span> },
  { accessorKey: "status", header: "Status", cell: (c) => <StatusBadge variant={c.getValue<StatusVariant>()} size="xs" /> },
];

const TRACE: Trace = {
  id: "TR-demo",
  runId: "RUN-901",
  stages: [
    { stage: "trigger", timestamp: "2026-06-20T08:46:00+02:00", summary: "Ticket created: ‘Where is my order?’", excerpts: [], evidenceIds: [], uncertainty: null, error: null },
    { stage: "evidence", timestamp: "2026-06-20T08:46:20+02:00", summary: "Retrieved tracking + shipping policy.", excerpts: ["ETA 2 days", "EU 3–5 business days"], evidenceIds: [], uncertainty: null, error: null },
    { stage: "tool-calls", timestamp: "2026-06-20T08:46:40+02:00", summary: "send-reply (wismo-eta).", excerpts: [], evidenceIds: [], uncertainty: null, error: null },
    { stage: "final-result", timestamp: "2026-06-20T08:46:45+02:00", summary: "Ticket auto-resolved.", excerpts: [], evidenceIds: [], uncertainty: null, error: null },
  ],
};

const APPROVAL: Approval = {
  id: "apr-demo",
  proposedAction: "Apply a 15% goodwill discount to VIP order ORD-1042.",
  targetRef: { id: "ORD-1042", kind: "order", label: "Order #1042" },
  impact: "≈ €37 margin reduction; retains a high-LTV customer.",
  impactAmount: -37,
  evidence: [],
  policyComparison: "Within policy: VIP delay goodwill capped at 15%.",
  requester: { kind: "agent", ref: { id: "ag-cs", kind: "agent", label: "CS Copilot" } },
  expiresAt: "2026-06-20T15:00:00+02:00",
  history: [],
  state: "pending",
  actionType: "discount",
};

const EVENTS: ActivityEvent[] = [
  { id: "e1", actorKind: "agent", actorRef: { id: "ag-cs", kind: "agent", label: "CS Copilot" }, action: "resolved ticket", targetRef: { id: "TKT-2003", kind: "ticket", label: "TKT-2003" }, result: "WISMO answered", department: "customer-service", storeId: null, at: "2026-06-20T08:46:00+02:00" },
  { id: "e2", actorKind: "human", actorRef: { id: "tm-ava", kind: "human", label: "Ava B." }, action: "created task", targetRef: null, result: "Assigned to Sam", department: "marketing", storeId: null, at: "2026-06-20T05:00:00+02:00" },
  { id: "e3", actorKind: "connector", actorRef: { id: "ch-meta", kind: "connector", label: "Meta Ads" }, action: "sync delayed", targetRef: null, result: "3h stale", department: "marketing", storeId: null, at: "2026-06-20T06:00:00+02:00" },
];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-16 space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

const NAV = [
  ["tokens", "Tokens"],
  ["status", "Status & actors"],
  ["controls", "Controls"],
  ["metrics", "Metrics"],
  ["charts", "Charts"],
  ["table", "Data table"],
  ["panels", "Panels"],
  ["records", "Records & trace"],
  ["feedback", "Feedback states"],
  ["forms", "Forms"],
];

export default function DesignSystemPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-20 flex h-12 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur">
        <Button asChild variant="ghost" size="sm" className="gap-1.5">
          <Link href="/command-center"><ArrowLeft className="size-4" /> Workspace</Link>
        </Button>
        <span className="text-sm font-medium">Design System</span>
        <SimulationBadge className="hidden sm:inline-flex" />
        <Button variant="ghost" size="icon" className="ml-auto size-8" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
          <Sun className="size-4 dark:hidden" />
          <Moon className="hidden size-4 dark:block" />
        </Button>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-6">
        <nav className="sticky top-16 hidden h-fit w-40 shrink-0 flex-col gap-0.5 text-sm lg:flex">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              {label}
            </a>
          ))}
        </nav>

        <div className="min-w-0 flex-1 space-y-10">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Ecom-OS component system</h1>
            <p className="mt-1 text-sm text-muted-foreground">Reusable components and their states. Toggle the theme to verify dark/light parity.</p>
          </div>

          <Section id="tokens" title="Tokens & color">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {[
                ["Success", "bg-success"], ["Warning", "bg-warning"], ["Critical", "bg-critical"],
                ["Info", "bg-info"], ["Agent", "bg-agent"], ["Primary", "bg-primary"],
              ].map(([label, c]) => (
                <div key={label} className="overflow-hidden rounded-lg border">
                  <div className={cn("h-12", c)} />
                  <div className="px-2 py-1 text-xs">{label}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["--color-chart-1", "--color-chart-2", "--color-chart-3", "--color-chart-4", "--color-chart-5", "--color-chart-6"].map((v) => (
                <div key={v} className="flex items-center gap-2 rounded-md border px-2 py-1 text-xs">
                  <span className="size-4 rounded" style={{ backgroundColor: `var(${v})` }} /> {v.replace("--color-", "")}
                </div>
              ))}
            </div>
          </Section>

          <Section id="status" title="Status, actors & freshness">
            <div className="flex flex-wrap gap-2">
              {STATUS_VARIANTS.map((v) => <StatusBadge key={v} variant={v} />)}
            </div>
            <div className="flex flex-wrap gap-2">
              {ACTOR_KINDS.map((k) => <ActorBadge key={k} kind={k} />)}
            </div>
            <div className="flex flex-wrap gap-4">
              <FreshnessIndicator freshness={{ updatedAt: "2026-06-20T08:52:00+02:00", sourceCount: 6, status: "healthy" }} />
              <FreshnessIndicator freshness={{ updatedAt: "2026-06-19T18:00:00+02:00", sourceCount: 6, status: "stale" }} />
              <FreshnessIndicator freshness={{ updatedAt: "2026-06-20T06:00:00+02:00", sourceCount: 4, status: "partial" }} />
            </div>
          </Section>

          <Section id="controls" title="Buttons & badges">
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="outline">Outline</Button>
              <Button size="sm" variant="secondary">Secondary</Button>
              <Button size="sm" variant="ghost">Ghost</Button>
              <Button size="sm" variant="destructive">Destructive</Button>
              <Button size="sm" disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["default", "secondary", "outline", "success", "warning", "critical", "info", "agent", "neutral"] as const).map((v) => (
                <Badge key={v} variant={v}>{v}</Badge>
              ))}
            </div>
          </Section>

          <Section id="metrics" title="Metrics">
            <MetricStrip
              columns={4}
              items={[
                { id: "1", label: "Contribution margin", value: 18420, format: "currency", trend: { direction: "down", deltaPct: -6.4 }, confidence: "partial", status: "warning", statusLabel: "Partial" },
                { id: "2", label: "Revenue", value: 67240, format: "currency", trend: { direction: "up", deltaPct: 4.2 } },
                { id: "3", label: "ROAS", value: 3.2, format: "multiplier", trend: { direction: "up", deltaPct: 2.1 } },
                { id: "4", label: "Orders", value: 412, format: "number", trend: { direction: "flat", deltaPct: 0.3 } },
              ]}
            />
          </Section>

          <Section id="charts" title="Charts">
            <div className="grid gap-4 lg:grid-cols-2">
              <Panel title="Time series">
                <TimeSeriesChart data={SERIES} series={[{ key: "revenue", label: "Revenue", color: "var(--color-chart-1)" }, { key: "margin", label: "Margin", color: "var(--color-chart-2)" }, { key: "spend", label: "Spend", color: "var(--color-chart-3)" }]} />
              </Panel>
              <Panel title="Profit bridge">
                <ProfitBridge steps={BRIDGE} />
              </Panel>
              <Panel title="Time series — empty">
                <TimeSeriesChart data={[]} series={[{ key: "revenue", label: "Revenue", color: "var(--color-chart-1)" }]} />
              </Panel>
            </div>
          </Section>

          <Section id="table" title="Data table">
            <DataTable columns={COLS} data={ROWS} searchKey searchPlaceholder="Search orders…" />
            <div className="grid gap-4 lg:grid-cols-2">
              <Panel title="Loading"><DataTable columns={COLS} data={[]} loading /></Panel>
              <Panel title="Empty"><DataTable columns={COLS} data={[]} emptyLabel="No orders match." /></Panel>
            </div>
          </Section>

          <Section id="panels" title="Panels & lists">
            <div className="grid gap-4 lg:grid-cols-3">
              <AttentionPanel
                className="lg:col-span-2"
                rows={[
                  { id: "1", title: "Supplier delay — Aurora Supply", detail: "14 orders late", severity: "critical", actorKind: "connector", href: "#" },
                  { id: "2", title: "Discount approval requested", detail: "VIP goodwill 15%", severity: "awaiting-approval", actorKind: "agent", href: "#" },
                ]}
              />
              <Panel title="Source health"><SourceHealthPanel sources={[
                { id: "s1", name: "Shopify", kind: "commerce", lastSyncAt: "2026-06-20T08:52:00+02:00", status: "healthy" },
                { id: "s2", name: "Meta Ads", kind: "ads", lastSyncAt: "2026-06-20T06:00:00+02:00", status: "stale", missingDataNote: "3h stale" },
                { id: "s3", name: "Stripe", kind: "payments", lastSyncAt: null, status: "disconnected", missingDataNote: "Reconnect required" },
              ]} /></Panel>
            </div>
            <Panel title="Ranked list">
              <RankedList rows={[
                { id: "1", label: "Google · Brand search", valueText: "€14,880", trend: { direction: "up", deltaPct: 3.1 }, status: "success", statusLabel: "ROAS 12×", progress: 1 },
                { id: "2", label: "Meta · Prospecting", valueText: "€16,240", trend: { direction: "down", deltaPct: -12.6 }, status: "critical", statusLabel: "ROAS 1.9×", progress: 0.4 },
              ]} />
            </Panel>
          </Section>

          <Section id="records" title="Records & trace">
            <div className="flex flex-wrap gap-2">
              <EntityLink entity={{ id: "ORD-1042", kind: "order", label: "Order #1042" }} />
              <EntityLink entity={{ id: "TKT-1188", kind: "ticket", label: "TKT-1188" }} />
              <EntityLink entity={{ id: "ag-cs", kind: "agent", label: "CS Copilot" }} />
              <EntityLink entity={{ id: "CAMP-1", kind: "campaign", label: "Meta · Prospecting" }} />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <Panel title="Trace timeline"><TraceTimeline trace={TRACE} /></Panel>
              <div className="space-y-4">
                <ApprovalCard approval={APPROVAL} onApprove={() => {}} onReject={() => {}} />
                <Panel title="Activity timeline"><ActivityTimeline events={EVENTS} /></Panel>
              </div>
            </div>
          </Section>

          <Section id="feedback" title="Feedback states">
            <StateBanner tone="warning" title="Partial data" description="COGS missing for 42 orders; figures are estimated." />
            <div className="grid gap-4 lg:grid-cols-3">
              <Panel title="Empty"><EmptyState variant="no-results" compact /></Panel>
              <Panel title="Error"><ErrorState compact description="The payouts source timed out." impact="Reconciliation is paused." onRetry={() => {}} /></Panel>
              <Panel title="Loading"><LoadingState shape="list" rows={4} /></Panel>
            </div>
            <InlineMessage tone="error">Discount exceeds the 15% policy ceiling.</InlineMessage>
          </Section>

          <Section id="forms" title="Forms & confirmation">
            <Button size="sm" onClick={() => setConfirmOpen(true)}>Open confirm dialog</Button>
            <ConfirmActionDialog
              open={confirmOpen}
              onOpenChange={setConfirmOpen}
              title="Apply goodwill discount"
              actor="You (Owner)"
              target="Order #1042 · Anna de Vries (VIP)"
              change="Apply a 15% goodwill discount code"
              reason="VIP affected by the Aurora Supply delay"
              consequence="≈ €37 reduction in contribution margin on this order"
              approvalRequired
              confirmLabel="Apply discount"
            />
          </Section>

          <div className="pt-6">
            <Link href="/command-center" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>Back to workspace</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
