"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getBreadcrumbs, resolveActiveRoute } from "@/config/routes";
import { cn } from "@/lib/utils";

/** Route-driven breadcrumb / title, derived from the pathname. */
export function HeaderBreadcrumb() {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname);
  const active = resolveActiveRoute(pathname);
  const Icon = active?.icon;

  if (crumbs.length === 0) {
    return <span className="text-sm font-medium">Ecom-OS</span>;
  }

  return (
    <nav className="flex min-w-0 items-center gap-1.5 text-sm" aria-label="Breadcrumb">
      {Icon && <Icon className="hidden size-4 shrink-0 text-muted-foreground sm:block" />}
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1;
        return (
          <span key={c.id} className="flex min-w-0 items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50" />}
            {last ? (
              <span className="truncate font-medium">{c.title}</span>
            ) : (
              <Link
                href={c.path}
                className={cn("truncate text-muted-foreground transition-colors hover:text-foreground")}
              >
                {c.title}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
