"use client";

import * as React from "react";
import { AlertTriangle, Check, Loader2, ShieldQuestion, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Phase = "review" | "submitting" | "success" | "failed" | "uncertain";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  actor: string;
  target: string;
  change: string;
  reason?: string;
  consequence: string;
  approvalRequired?: boolean;
  destructive?: boolean;
  confirmLabel?: string;
  outcome?: "success" | "failed" | "uncertain";
  onConfirmed?: () => void;
};

/**
 * Review-step confirmation for a consequential simulated action. Shows actor,
 * exact target, exact change, reason, expected consequence, and approval flag,
 * then progress → success/failure/uncertain. Disables duplicate submission.
 */
export function ConfirmActionDialog({ open, onOpenChange, ...rest }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {/* Body remounts each open (Radix unmounts closed content), so phase resets without an effect. */}
        <ConfirmBody {...rest} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function ConfirmBody({
  title,
  actor,
  target,
  change,
  reason,
  consequence,
  approvalRequired,
  destructive,
  confirmLabel = "Confirm",
  outcome = "success",
  onConfirmed,
  onClose,
}: Omit<Props, "open" | "onOpenChange"> & { onClose: () => void }) {
  const [phase, setPhase] = React.useState<Phase>("review");

  const submit = () => {
    setPhase("submitting");
    window.setTimeout(() => {
      setPhase(outcome);
      if (outcome === "success") onConfirmed?.();
    }, 600);
  };

  const reviewing = phase === "review" || phase === "submitting";

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {destructive && <AlertTriangle className="size-4 text-critical" />}
          {title}
        </DialogTitle>
        <DialogDescription>Review the exact change before confirming. This is simulated.</DialogDescription>
      </DialogHeader>

      {reviewing ? (
        <div className="space-y-2.5 text-sm">
          <Field label="Actor" value={actor} />
          <Field label="Target" value={target} />
          <Field label="Change" value={change} emphatic />
          {reason && <Field label="Reason" value={reason} />}
          <Field label="Consequence" value={consequence} />
          {approvalRequired && (
            <div className="flex items-center gap-2 rounded-md bg-warning-surface px-2.5 py-1.5 text-xs text-warning-foreground">
              <ShieldQuestion className="size-3.5" /> Requires approval before it can execute.
            </div>
          )}
        </div>
      ) : (
        <Outcome phase={phase} />
      )}

      <DialogFooter>
        {reviewing ? (
          <>
            <Button variant="outline" size="sm" onClick={onClose} disabled={phase === "submitting"}>
              <X className="size-3.5" /> Cancel
            </Button>
            <Button size="sm" variant={destructive ? "destructive" : "default"} onClick={submit} disabled={phase === "submitting"}>
              {phase === "submitting" ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
              {confirmLabel}
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </DialogFooter>
    </>
  );
}

function Field({ label, value, emphatic }: { label: string; value: string; emphatic?: boolean }) {
  return (
    <div className="flex gap-3">
      <span className="w-24 shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className={cn("min-w-0 flex-1", emphatic && "font-medium")}>{value}</span>
    </div>
  );
}

function Outcome({ phase }: { phase: Phase }) {
  const map = {
    success: { icon: Check, accent: "text-success", title: "Done (simulated)", body: "The change was applied to local prototype state and an activity entry was appended." },
    failed: { icon: X, accent: "text-critical", title: "Action failed", body: "The simulated action failed. Your input is preserved — you can retry or cancel." },
    uncertain: { icon: ShieldQuestion, accent: "text-warning", title: "Outcome uncertain", body: "The external result is unconfirmed. Reconcile before retrying — a retry could duplicate the action." },
  } as const;
  const o = phase === "failed" ? map.failed : phase === "uncertain" ? map.uncertain : map.success;
  const Icon = o.icon;
  return (
    <div className="flex flex-col items-center gap-2 py-4 text-center">
      <Icon className={cn("size-8", o.accent)} />
      <div className="text-sm font-medium">{o.title}</div>
      <p className="max-w-sm text-xs text-muted-foreground">{o.body}</p>
    </div>
  );
}
