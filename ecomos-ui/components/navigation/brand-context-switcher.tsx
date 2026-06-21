"use client";

import * as React from "react";
import Link from "next/link";
import { Plug, Settings, Store as StoreIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { STORE } from "@/data/base/brand";

/**
 * Brand / store identity. Ecom-OS is single-store, so this is NOT a store
 * switcher — it shows the one store and links to its settings and connections.
 */
export function BrandContextSwitcher() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex w-full items-center gap-2.5 -m-0.5 rounded-md p-1 transition-colors hover:bg-sidebar-accent"
          aria-label="Store"
        >
          {!collapsed && (
            <div className="min-w-0 flex-1 text-left">
              <div className="truncate text-sm font-medium leading-tight">{STORE.name}</div>
              <div className="truncate text-[11px] leading-tight text-muted-foreground">{STORE.domain}</div>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60">
        <DropdownMenuLabel>
          <div className="truncate text-sm leading-tight">{STORE.name}</div>
          <div className="truncate text-[11px] font-normal leading-tight text-muted-foreground">
            {STORE.domain} · {STORE.currency}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-1 text-[11px] text-muted-foreground">All connections healthy</div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings/stores" className="gap-2">
            <StoreIcon className="size-4" /> Store settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings/integrations" className="gap-2">
            <Plug className="size-4" /> Integrations
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="gap-2">
            <Settings className="size-4" /> Brand settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
