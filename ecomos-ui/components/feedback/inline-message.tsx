import * as React from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type InlineMessageTone = "error" | "warning" | "success" | "info";

const TONE_CONFIG: Record<
  InlineMessageTone,
  { icon: React.ComponentType<{ className?: string }>; accent: string }
> = {
  error: { icon: AlertCircle, accent: "text-critical" },
  warning: { icon: TriangleAlert, accent: "text-warning" },
  success: { icon: CheckCircle2, accent: "text-success" },
  info: { icon: Info, accent: "text-info" },
};

/**
 * Field/local validation message. Pair with a form control via `id` so the
 * control can reference it through aria-describedby.
 */
export function InlineMessage({
  children,
  tone = "error",
  id,
  className,
  showIcon = true,
}: {
  children: React.ReactNode;
  tone?: InlineMessageTone;
  id?: string;
  className?: string;
  showIcon?: boolean;
}) {
  const config = TONE_CONFIG[tone];
  const Icon = config.icon;
  return (
    <p
      id={id}
      role={tone === "error" ? "alert" : "status"}
      className={cn("flex items-start gap-1.5 text-xs", config.accent, className)}
    >
      {showIcon && <Icon className="mt-px size-3.5 shrink-0" aria-hidden />}
      <span>{children}</span>
    </p>
  );
}
