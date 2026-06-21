import type { RouteMeta, RouteSection, BadgeKind } from "@/config/routes";
import { getChildren, getRouteById } from "@/config/routes";

/**
 * Sidebar navigation model, derived from the typed route registry.
 *
 * Design decision (documented in IMPLEMENTATION-NOTES): Core items
 * (Command Center, Inbox, My Tasks) render as flat shortcuts with badges —
 * their subpages are surfaced as in-page tabs and via the command palette,
 * not as sidebar children. Departments / Intelligence / System render as
 * expandable groups whose first child is the route's own Overview.
 */

export type NavNode = {
  route: RouteMeta;
  /** Children to render in the sidebar (departments expose subpages; core does not). */
  children: NavNode[];
  /** True when this node can expand/collapse a submenu. */
  expandable: boolean;
  badge?: BadgeKind;
};

function buildDepartmentNode(parentId: string): NavNode | null {
  const route = getRouteById(parentId);
  if (!route) return null;
  const childRoutes = getChildren(parentId);
  // No synthetic "Overview" item — the department root IS the top page, reached
  // by clicking the department label. The submenu lists only the subpages.
  const children = childRoutes.map<NavNode>((r) => ({ route: r, children: [], expandable: false }));
  return {
    route,
    children,
    expandable: true,
    badge: route.badge,
  };
}

function flatNode(id: string): NavNode | null {
  const route = getRouteById(id);
  if (!route) return null;
  return { route, children: [], expandable: false, badge: route.badge };
}

export type NavSection = {
  id: RouteSection;
  label: string;
  nodes: NavNode[];
};

function compact(nodes: (NavNode | null)[]): NavNode[] {
  return nodes.filter((n): n is NavNode => n !== null);
}

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "core",
    label: "Core",
    nodes: compact([flatNode("command-center"), flatNode("inbox"), flatNode("tasks")]),
  },
  {
    id: "departments",
    label: "Departments",
    nodes: compact([
      buildDepartmentNode("customer-service"),
      buildDepartmentNode("finance"),
      buildDepartmentNode("marketing"),
      buildDepartmentNode("commerce"),
      buildDepartmentNode("operations"),
    ]),
  },
  {
    id: "intelligence",
    label: "Intelligence",
    nodes: compact([
      buildDepartmentNode("agents"),
      buildDepartmentNode("knowledge"),
      buildDepartmentNode("activity"),
    ]),
  },
  {
    id: "system",
    label: "System",
    nodes: compact([buildDepartmentNode("settings")]),
  },
];

/** Department ids that own an expandable submenu (used for auto-expand on active). */
export const EXPANDABLE_PARENT_IDS = NAV_SECTIONS.flatMap((s) =>
  s.nodes.filter((n) => n.expandable).map((n) => n.route.id),
);
