"use client";

import Link from "next/link";
import { Check, LogOut, Settings, ShieldCheck, UserCog } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_IDS, ROLES } from "@/data/scenario";
import { useScenarioStore } from "@/data/scenario-store";

/**
 * Operator profile + local role-preview switcher (visual only, no auth).
 * Switching role previews hidden/read-only/approval-only states elsewhere.
 */
export function ProfileMenu() {
  const role = useScenarioStore((s) => s.role);
  const setRole = useScenarioStore((s) => s.setRole);
  const current = ROLES[role];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full transition-opacity hover:opacity-80" aria-label="Profile and role">
          <Avatar className="size-7">
            <AvatarFallback className="text-[11px]">AB</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="px-2 py-1.5">
          <div className="text-sm font-medium">Ava Bergström</div>
          <div className="text-[11px] text-muted-foreground">ava@northstar-goods.example</div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5" /> Role preview · {current.label}
        </DropdownMenuLabel>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="gap-2">
            <UserCog className="size-4" /> Switch role
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-56">
            {ROLE_IDS.map((id) => (
              <DropdownMenuItem key={id} onClick={() => setRole(id)} className="flex-col items-start gap-0.5 py-1.5">
                <span className="flex w-full items-center gap-2">
                  <span className="flex-1 text-sm">{ROLES[id].label}</span>
                  {role === id && <Check className="size-3.5" />}
                </span>
                <span className="text-[11px] leading-snug text-muted-foreground">{ROLES[id].description}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="gap-2">
            <Settings className="size-4" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 text-muted-foreground" disabled>
          <LogOut className="size-4" /> Sign out (disabled in prototype)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
