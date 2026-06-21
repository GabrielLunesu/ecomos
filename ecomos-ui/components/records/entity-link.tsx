"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bot,
  FileText,
  Megaphone,
  Package,
  Receipt,
  Route as RouteIcon,
  ShieldCheck,
  ShoppingBag,
  TriangleAlert,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EntityRef } from "@/data/schema";

const KIND_META: Record<string, { icon: React.ComponentType<{ className?: string }>; href: (id: string) => string }> = {
  order: { icon: ShoppingBag, href: () => "/commerce/orders" },
  customer: { icon: Users, href: () => "/commerce/customers" },
  product: { icon: Package, href: () => "/commerce/products" },
  ticket: { icon: Receipt, href: () => "/customer-service/tickets" },
  campaign: { icon: Megaphone, href: () => "/marketing/campaigns" },
  agent: { icon: Bot, href: () => "/agents/list" },
  run: { icon: RouteIcon, href: () => "/agents/runs" },
  action: { icon: RouteIcon, href: () => "/activity/actions" },
  approval: { icon: ShieldCheck, href: () => "/inbox/approvals" },
  exception: { icon: TriangleAlert, href: () => "/operations/exceptions" },
  supplier: { icon: Package, href: () => "/operations/suppliers" },
  task: { icon: FileText, href: () => "/tasks" },
  document: { icon: FileText, href: () => "/knowledge/documents" },
  account: { icon: Megaphone, href: () => "/marketing/campaigns" },
  human: { icon: User, href: () => "/settings/team" },
};

/** Consistent link/preview chip for any seeded entity. */
export function EntityLink({ entity, className, showIcon = true }: { entity: EntityRef; className?: string; showIcon?: boolean }) {
  const meta = KIND_META[entity.kind] ?? { icon: FileText, href: () => "#" };
  const Icon = meta.icon;
  const href = meta.href(entity.id);
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border bg-card px-2 py-0.5 text-xs transition-colors hover:bg-accent",
        className,
      )}
      title={`${entity.kind}: ${entity.label}`}
    >
      {showIcon && <Icon className="size-3 shrink-0 text-muted-foreground" />}
      <span className="truncate">{entity.label}</span>
    </Link>
  );
}
