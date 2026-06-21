"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS, type NavNode } from "@/config/navigation";
import { resolveActiveRoute } from "@/config/routes";
import { useScenarioStore } from "@/data/scenario-store";
import { getNavBadges } from "@/data/selectors/nav-badges";
import { BRAND } from "@/data/base/brand";
import { BrandContextSwitcher } from "@/components/navigation/brand-context-switcher";
import { SidebarSystemStatus } from "@/components/navigation/sidebar-system-status";
import { SimulationBadge } from "@/components/feedback/simulation-badge";
import { EcomOsLogo } from "@/components/brand/ecomos-logo";

/**
 * Route-driven sidebar.
 *
 * Active state derives entirely from the pathname — there are no hard-coded
 * `isActive` flags and no `href="#"`. Department labels navigate to the
 * overview and expand; the chevron only toggles disclosure.
 */
export function AppSidebar() {
  const pathname = usePathname();
  const active = resolveActiveRoute(pathname);
  const scenario = useScenarioStore((s) => s.scenario);
  const badges = getNavBadges(scenario);
  const inventoryEnabled = BRAND.inventoryEnabled;

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="px-2.5 py-2.5">
        <BrandContextSwitcher />
      </SidebarHeader>

      <SidebarContent className="px-2.5 gap-1">
        {/* Ask Ecom-OS is the primary assistant surface — topmost launcher. */}
        <SidebarMenu className="mt-1.5">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/chat")}
              tooltip="Ask Ecom-OS"
              className="h-8 bg-info-surface/60 font-medium text-info-foreground hover:bg-info-surface hover:text-info-foreground"
            >
              <Link href="/chat">
                <Sparkles className="size-4" />
                <span className="text-sm">Ask Ecom-OS</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {NAV_SECTIONS.map((section) => (
          <SidebarGroup key={section.id} className="p-0 mt-1.5">
            <SidebarGroupLabel className="px-2 h-5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.nodes.map((node) =>
                  node.expandable ? (
                    <DepartmentItem
                      key={node.route.id}
                      node={node}
                      activeId={active?.id}
                      activePath={pathname}
                      inventoryEnabled={inventoryEnabled}
                      approvalsBadge={badges.approvals}
                    />
                  ) : (
                    <FlatItem
                      key={node.route.id}
                      node={node}
                      active={active?.id === node.route.id}
                      badgeCount={
                        node.badge ? badges[node.badge as keyof typeof badges] : undefined
                      }
                    />
                  ),
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="gap-2 px-2.5 pb-2.5">
        <SimulationBadge className="self-start group-data-[collapsible=icon]:hidden" />
        <SidebarSystemStatus />
        {/* Product logo at the very bottom (hidden when the rail is collapsed). */}
        <div className="group-data-[collapsible=icon]:hidden">
          <EcomOsLogo />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function FlatItem({
  node,
  active,
  badgeCount,
}: {
  node: NavNode;
  active: boolean;
  badgeCount?: number;
}) {
  const { route } = node;
  const Icon = route.icon;
  const { setOpenMobile, isMobile } = useSidebar();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={active}
        tooltip={route.label}
        className="h-7"
        onClick={() => isMobile && setOpenMobile(false)}
      >
        <Link href={route.path}>
          <Icon className="size-4" />
          <span className="text-sm">{route.label}</span>
        </Link>
      </SidebarMenuButton>
      {badgeCount ? <SidebarMenuBadge>{badgeCount}</SidebarMenuBadge> : null}
    </SidebarMenuItem>
  );
}

function DepartmentItem({
  node,
  activeId,
  activePath,
  inventoryEnabled,
  approvalsBadge,
}: {
  node: NavNode;
  activeId: string | undefined;
  activePath: string;
  inventoryEnabled: boolean;
  approvalsBadge: number;
}) {
  const { route } = node;
  const Icon = route.icon;
  const { setOpenMobile, isMobile } = useSidebar();

  // A department is active when the active route is the department or any child.
  const childIds = node.children.map((c) => c.route.id);
  const isDepartmentActive =
    activeId === route.id || (activeId ? childIds.includes(activeId) : false);

  // Active department is always open; otherwise the chevron toggles a manual
  // open state. Derived (no effect) so active-route expansion always wins.
  const [manualOpen, setManualOpen] = React.useState(false);
  const open = isDepartmentActive || manualOpen;
  const setOpen = (v: boolean) => setManualOpen(v);

  const visibleChildren = node.children.filter(
    (c) => !(c.route.optionalFeature === "inventory" && !inventoryEnabled),
  );

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
      <SidebarMenuItem>
        {/* Label navigates to the overview AND expands. */}
        <SidebarMenuButton
          asChild
          isActive={isDepartmentActive}
          tooltip={route.title}
          className="h-7 pr-7"
          onClick={() => {
            setOpen(true);
            if (isMobile) setOpenMobile(false);
          }}
        >
          <Link href={route.path}>
            <Icon className="size-4" />
            <span className="text-sm">{route.title}</span>
          </Link>
        </SidebarMenuButton>

        {/* Chevron ONLY toggles — does not navigate. */}
        <button
          type="button"
          aria-label={open ? `Collapse ${route.title}` : `Expand ${route.title}`}
          aria-expanded={open}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setManualOpen(!open);
          }}
          className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group-data-[collapsible=icon]:hidden"
        >
          <ChevronRight
            className={cn("size-3.5 transition-transform duration-200", open && "rotate-90")}
          />
        </button>

        <CollapsibleContent>
          <SidebarMenuSub className="mr-0 pr-0">
            {visibleChildren.map((child) => {
              const childActive =
                activeId === child.route.id ||
                (child.route.isOverview && activePath === route.path);
              const showApprovals =
                child.route.id.endsWith(".approvals") && approvalsBadge > 0;
              return (
                <SidebarMenuSubItem key={child.route.id}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={childActive}
                    className="h-7"
                    onClick={() => isMobile && setOpenMobile(false)}
                  >
                    <Link href={child.route.path}>
                      <span>{child.route.label}</span>
                      {showApprovals ? (
                        <span className="ml-auto rounded bg-warning-surface px-1.5 text-[10px] font-medium text-warning-foreground">
                          {approvalsBadge}
                        </span>
                      ) : null}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
