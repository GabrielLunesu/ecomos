"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HeaderBreadcrumb } from "@/components/shell/header-breadcrumb";
import { PresenceCluster } from "@/components/shell/presence-cluster";
import { NotificationsMenu } from "@/components/shell/notifications-menu";
import { ScenarioSwitcher } from "@/components/shell/scenario-switcher";
import { DateRangeControl } from "@/components/shell/date-range-control";
import { ChatHistoryButton } from "@/components/chat/chat-history-button";
import { ThemeToggle } from "@/components/shell/theme-toggle";
import { ProfileMenu } from "@/components/shell/profile-menu";
import { FreshnessIndicator, FRESHNESS_CONFIG } from "@/components/feedback/freshness-indicator";
import { freshnessForScenario } from "@/components/page/page-context-meta";
import { useScenarioStore } from "@/data/scenario-store";
import { cn } from "@/lib/utils";

/**
 * The single command bar. Left: route identity + a compact freshness icon
 * (details in a popover). Right: the date-range control stays labeled;
 * everything else is an icon with its own menu/popover. Single-store app —
 * no store-scope control.
 */
export function GlobalHeader() {
  const pathname = usePathname();
  const isChat = pathname.startsWith("/chat");
  const setPaletteOpen = useScenarioStore((s) => s.setCommandPaletteOpen);
  const scenario = useScenarioStore((s) => s.scenario);
  const freshness = freshnessForScenario(scenario);
  const FreshIcon = FRESHNESS_CONFIG[freshness.status].icon;

  return (
    <header className="sticky top-0 z-20 flex h-[52px] shrink-0 items-center gap-2 border-b bg-card/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-card/80 sm:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-1 hidden h-5 sm:block" />
        <HeaderBreadcrumb />

        {/* Freshness collapses to an icon; details live in a popover. */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="size-7 shrink-0" aria-label="Data freshness">
              <FreshIcon className={cn("size-4", FRESHNESS_CONFIG[freshness.status].accent)} />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-64">
            <div className="mb-1.5 text-xs font-medium">Data freshness</div>
            <FreshnessIndicator freshness={freshness} />
            <Separator className="my-2" />
            <Link href="/finance/reconciliation" className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
              View sources &amp; reconciliation
            </Link>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-1">
        {isChat && <ChatHistoryButton />}
        <DateRangeControl />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPaletteOpen(true)}
          className="size-8"
          aria-label="Search (⌘K)"
          title="Search (⌘K)"
        >
          <Search className="size-4" />
        </Button>

        <div className="hidden items-center lg:flex">
          <PresenceCluster />
          <Separator orientation="vertical" className="mx-1.5 h-5" />
        </div>

        <NotificationsMenu />
        <ScenarioSwitcher />
        <ThemeToggle />
        <div className="ml-0.5">
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
