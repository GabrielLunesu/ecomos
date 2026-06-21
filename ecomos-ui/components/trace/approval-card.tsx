"use client";

import * as React from "react";
import { Check, Clock, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EntityLink } from "@/components/records/entity-link";
import { ActorBadge } from "@/components/feedback/actor-badge";
import { StatusBadge } from "@/components/feedback/status";
import { formatRelativeTime } from "@/lib/formatting";
import type { Approval } from "@/data/schema";

/**
 * Approval review surface: exact proposed action, target, impact, evidence,
 * policy comparison, requester, expiry, and approve/reject (simulated).
 */
export function ApprovalCard({
  approval,
  decision,
  onApprove,
  onReject,
  disabled,
  className,
}: {
  approval: Approval;
  /** Resolved decision overlay; undefined when still pending. */
  decision?: "approved" | "rejected";
  onApprove?: () => void;
  onReject?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const resolved = decision ?? (approval.state === "approved" ? "approved" : approval.state === "rejected" ? "rejected" : undefined);

  return (
    <div className={cn("rounded-lg border bg-card p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-warning" />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {approval.actionType} approval
          </span>
        </div>
        {resolved ? (
          <StatusBadge variant={resolved === "approved" ? "success" : "critical"} label={resolved === "approved" ? "Approved" : "Rejected"} size="xs" />
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="size-3" /> Expires {formatRelativeTime(approval.expiresAt)}
          </span>
        )}
      </div>

      <p className="mt-2 text-sm font-medium">{approval.proposedAction}</p>

      <dl className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
        <Row label="Target">
          <EntityLink entity={approval.targetRef} />
        </Row>
        <Row label="Requested by">
          <ActorBadge kind={approval.requester.kind} name={approval.requester.ref?.label} variant="inline" />
        </Row>
        <Row label="Impact" full>
          <span className="text-muted-foreground">{approval.impact}</span>
        </Row>
        <Row label="Policy" full>
          <span className="text-muted-foreground">{approval.policyComparison}</span>
        </Row>
      </dl>

      {!resolved && (onApprove || onReject) && (
        <div className="mt-4 flex items-center gap-2">
          <Button size="sm" className="h-8 gap-1.5" onClick={onApprove} disabled={disabled}>
            <Check className="size-3.5" /> Approve
          </Button>
          <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={onReject} disabled={disabled}>
            <X className="size-3.5" /> Reject
          </Button>
          <span className="ml-auto text-[10px] text-muted-foreground">Simulated — no real action is taken.</span>
        </div>
      )}
    </div>
  );
}

function Row({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", full && "sm:col-span-2")}>
      <dt className="w-20 shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}
