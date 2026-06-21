"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusBadge } from "@/components/feedback/status";
import { ActorBadge } from "@/components/feedback/actor-badge";
import { formatRelativeTime } from "@/lib/formatting";
import { useScenarioStore } from "@/data/scenario-store";
import type { ScenarioId } from "@/data/scenario";
import type { StatusVariant, ActorKind } from "@/data/schema";

type Notif = {
  id: string;
  group: "Approvals" | "Customer service" | "Finance & data" | "Agents & system" | "Mentions";
  title: string;
  detail: string;
  href: string;
  at: string;
  variant: StatusVariant;
  actor: ActorKind;
};

const BASE: Notif[] = [
  { id: "n1", group: "Approvals", title: "Discount approval requested", detail: "Agent proposed 15% WISMO goodwill code for VIP order ORD-1042", href: "/inbox/approvals", at: "2026-06-20T08:41:00+02:00", variant: "awaiting-approval", actor: "agent" },
  { id: "n2", group: "Customer service", title: "Ticket escalated", detail: "TKT-1188 reopened with negative sentiment", href: "/customer-service/tickets", at: "2026-06-20T08:22:00+02:00", variant: "critical", actor: "human" },
  { id: "n3", group: "Finance & data", title: "Contribution margin down 6.4%", detail: "Driven by ad spend on CAMP-Meta-Prospecting", href: "/finance", at: "2026-06-20T07:55:00+02:00", variant: "warning", actor: "system" },
  { id: "n4", group: "Agents & system", title: "Run failed", detail: "RUN-882 outbound send returned a connector error", href: "/agents/runs", at: "2026-06-20T07:30:00+02:00", variant: "blocked", actor: "agent" },
  { id: "n5", group: "Mentions", title: "Priya mentioned you", detail: "“Can you confirm the supplier ETA before we reply?”", href: "/inbox/mentions", at: "2026-06-20T06:48:00+02:00", variant: "info", actor: "human" },
];

const INCIDENT_EXTRA: Notif[] = [
  { id: "n6", group: "Agents & system", title: "Supplier delay detected", detail: "Aurora Supply shipment delayed — 14 orders affected", href: "/operations/exceptions", at: "2026-06-20T08:50:00+02:00", variant: "critical", actor: "connector" },
];

function notificationsFor(scenario: ScenarioId): Notif[] {
  if (scenario === "empty") return [];
  if (scenario === "incident") return [...INCIDENT_EXTRA, ...BASE];
  if (scenario === "healthy") return BASE.slice(2);
  return BASE;
}

export function NotificationsMenu() {
  const scenario = useScenarioStore((s) => s.scenario);
  const items = notificationsFor(scenario);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative size-8" aria-label="Notifications">
          <Bell className="size-4" />
          {items.length > 0 && (
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-critical" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2.5">
          <span className="text-sm font-medium">Notifications</span>
          <span className="text-xs text-muted-foreground">{items.length} recent</span>
        </div>
        {items.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            Nothing needs attention right now.
          </div>
        ) : (
          <ScrollArea className="max-h-96">
            <div className="divide-y">
              {items.map((n) => (
                <Link
                  key={n.id}
                  href={n.href}
                  className="block px-3 py-2.5 transition-colors hover:bg-accent/60"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      {n.group}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{formatRelativeTime(n.at)}</span>
                  </div>
                  <div className="mt-0.5 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{n.title}</div>
                      <div className="line-clamp-1 text-xs text-muted-foreground">{n.detail}</div>
                    </div>
                    <StatusBadge variant={n.variant} size="xs" showIcon={false} />
                  </div>
                  <div className="mt-1">
                    <ActorBadge kind={n.actor} variant="inline" className="text-[11px] text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        )}
        <div className="border-t p-2">
          <Button asChild variant="ghost" size="sm" className="w-full justify-center text-xs">
            <Link href="/inbox">Open Inbox</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
