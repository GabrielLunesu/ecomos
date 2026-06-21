"use client";

import * as React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { GlobalHeader } from "@/components/shell/global-header";
import { CommandPalette } from "@/components/shell/command-palette";
import { GlobalStateBanner } from "@/components/shell/global-state-banner";

/**
 * Owns the sidebar, header, page workspace, overlay portals, and Ask panel.
 * Desktop uses an inset, bordered application canvas; the content frame owns
 * scrolling while the sidebar and header stay stable.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="bg-sidebar">
      <AppSidebar />
      <div className="h-svh w-full overflow-hidden lg:p-2">
        <div className="flex h-full w-full flex-col overflow-hidden bg-background lg:rounded-lg lg:border lg:shadow-sm">
          <GlobalHeader />
          <GlobalStateBanner />
          <main data-slot="workspace-page" className="min-h-0 flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
      <CommandPalette />
    </SidebarProvider>
  );
}
