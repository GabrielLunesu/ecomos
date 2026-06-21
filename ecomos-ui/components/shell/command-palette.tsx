"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CircleHelp,
  FileText,
  FlaskConical,
  Hash,
  LayoutGrid,
  Package,
  Receipt,
  Sparkles,
  Users,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { ROUTES, SECTION_LABELS, type RouteSection } from "@/config/routes";
import { SCENARIO_IDS, SCENARIOS } from "@/data/scenario";
import { useScenarioStore } from "@/data/scenario-store";

/** A few seeded records so multi-entity search reads as real. */
const SEED_RECORDS = [
  { id: "ORD-1042", label: "Order ORD-1042 · €248.00 · VIP", href: "/commerce/orders", icon: Receipt },
  { id: "ORD-1188", label: "Order ORD-1188 · refunded", href: "/commerce/orders", icon: Receipt },
  { id: "TKT-1188", label: "Ticket TKT-1188 · escalated", href: "/customer-service/tickets", icon: Hash },
  { id: "CUST-204", label: "Customer · Mara Lindqvist", href: "/commerce/customers", icon: Users },
  { id: "PROD-12", label: "Product · Linen Throw Blanket", href: "/commerce/products", icon: Package },
  { id: "RUN-882", label: "Run RUN-882 · failed send", href: "/agents/runs", icon: Sparkles },
  { id: "DOC-shipping", label: "Document · Shipping policy", href: "/knowledge/brand-vault", icon: FileText },
];

const SECTION_ORDER: RouteSection[] = ["core", "departments", "intelligence", "system"];

export function CommandPalette() {
  const open = useScenarioStore((s) => s.commandPaletteOpen);
  const setOpen = useScenarioStore((s) => s.setCommandPaletteOpen);
  const setScenario = useScenarioStore((s) => s.setScenario);
  const router = useRouter();

  // Global keyboard: Cmd/Ctrl+K toggles; "/" opens when not typing.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
        return;
      }
      if (e.key === "/" && !open) {
        const el = document.activeElement;
        const typing =
          el instanceof HTMLInputElement ||
          el instanceof HTMLTextAreaElement ||
          (el instanceof HTMLElement && el.isContentEditable);
        if (!typing) {
          e.preventDefault();
          setOpen(true);
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const navBySection = SECTION_ORDER.map((section) => ({
    section,
    routes: ROUTES.filter((r) => r.section === section && (r.isOverview || !r.parentId || r.parentId)),
  }));

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command palette" description="Search and navigate">
      <CommandInput placeholder="Search pages, orders, tickets, customers, agents…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Search records">
          {SEED_RECORDS.map((r) => {
            const Icon = r.icon;
            return (
              <CommandItem key={r.id} value={`${r.id} ${r.label}`} onSelect={() => go(r.href)}>
                <Icon className="size-4 text-muted-foreground" />
                <span>{r.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        {navBySection.map(({ section, routes }) => (
          <CommandGroup key={section} heading={`Navigate · ${SECTION_LABELS[section]}`}>
            {routes.map((r) => {
              const Icon = r.icon;
              return (
                <CommandItem key={r.id} value={`${r.title} ${r.path}`} onSelect={() => go(r.path)}>
                  <Icon className="size-4 text-muted-foreground" />
                  <span>{r.title}</span>
                  {r.build === "placeholder" && (
                    <span className="ml-auto text-[10px] text-muted-foreground">placeholder</span>
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem value="ask ecom-os" onSelect={() => go("/chat")}>
            <Sparkles className="size-4 text-agent" />
            <span>Ask Ecom-OS</span>
          </CommandItem>
          <CommandItem value="design system" onSelect={() => go("/design-system")}>
            <LayoutGrid className="size-4 text-muted-foreground" />
            <span>Open Design System</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Switch scenario">
          {SCENARIO_IDS.map((id) => (
            <CommandItem
              key={id}
              value={`scenario ${SCENARIOS[id].label}`}
              onSelect={() => { setScenario(id); setOpen(false); }}
            >
              <FlaskConical className="size-4 text-muted-foreground" />
              <span>{SCENARIOS[id].label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Help">
          <CommandItem value="help" onSelect={() => go("/settings")}>
            <CircleHelp className="size-4 text-muted-foreground" />
            <span>Settings &amp; help</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
