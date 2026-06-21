import * as React from "react";
import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Small "Simulated" marker. The prototype must make clear that writes and model
 * responses are simulated, without putting a distracting badge on everything.
 * Use it once per surface (dialog footer, action result, Ask composer).
 */
export function SimulationBadge({
  label = "Simulated",
  className,
  showIcon = true,
}: {
  label?: string;
  className?: string;
  showIcon?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-agent-surface px-1.5 py-0.5 text-[11px] font-medium text-agent-foreground",
        className,
      )}
      title="No real action is performed in this prototype."
    >
      {showIcon && <FlaskConical className="size-3 shrink-0" aria-hidden />}
      <span>{label}</span>
    </span>
  );
}
