"use client";

import Link from "next/link";
import { ArrowRight, Compass, LayoutGrid } from "lucide-react";
import { PageBody } from "@/components/page/page-body";
import { getChildren, getRouteById, getRouteByPath, type RouteMeta } from "@/config/routes";
import { Badge } from "@/components/ui/badge";

/**
 * Scaffolded route from the approved map. Honest about being a placeholder
 * while still providing real navigation: the operator question, sibling
 * subpages, and the department overview.
 */
export function PlaceholderPage({ routeId, path }: { routeId?: string; path?: string }) {
  const route: RouteMeta | undefined = routeId
    ? getRouteById(routeId)
    : path
      ? getRouteByPath(path)
      : undefined;

  if (!route) {
    return (
      <PageBody>
        <p className="text-sm text-muted-foreground">Unknown route.</p>
      </PageBody>
    );
  }

  const parent = route.parentId ? getRouteById(route.parentId) : undefined;
  const siblings = parent ? getChildren(parent.id) : route.isOverview ? getChildren(route.id) : [];

  return (
    <PageBody className="max-w-4xl space-y-4">
      <p className="text-sm text-muted-foreground">{route.description}</p>
      <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <Compass className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-medium">Scaffolded surface</h2>
            <Badge variant="neutral" className="font-normal">Planned</Badge>
          </div>
          <p className="mt-2 max-w-prose text-sm text-muted-foreground">
            This route is part of the approved information architecture and is fully navigable.
            The first build slice delivers the application shell plus the Command Center, Finance,
            Customer Service and Activity &amp; Traces overviews, the full chat, and the design system.
            The composition for this page is defined in the page blueprints and will be built next.
          </p>

          {siblings.length > 0 && (
            <div className="mt-5">
              <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {parent ? `More in ${parent.title}` : "Subpages"}
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {parent && (
                  <SiblingLink route={parent} label={`${parent.title} overview`} />
                )}
                {siblings
                  .filter((s) => s.id !== route.id)
                  .map((s) => (
                    <SiblingLink key={s.id} route={s} />
                  ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center gap-3 text-sm">
            <Link
              href="/design-system"
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <LayoutGrid className="size-3.5" /> View the component library
            </Link>
          </div>
        </div>
    </PageBody>
  );
}

function SiblingLink({ route, label }: { route: RouteMeta; label?: string }) {
  const Icon = route.icon;
  return (
    <Link
      href={route.path}
      className="group flex items-center gap-2.5 rounded-md border bg-background px-3 py-2 transition-colors hover:bg-accent"
    >
      <Icon className="size-4 text-muted-foreground" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm">{label ?? route.label}</span>
        <span className="block truncate text-[11px] text-muted-foreground">{route.description}</span>
      </span>
      <ArrowRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}
