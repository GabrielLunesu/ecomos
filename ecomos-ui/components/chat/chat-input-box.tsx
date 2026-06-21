"use client";

import { CircleDashed, CornerDownLeft, Paperclip, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  /** Welcome screen uses a taller box; the conversation view is more compact. */
  size?: "lg" | "md";
}

/**
 * The Ask Ecom-OS composer. Attach and the tool chips are prototype-only
 * affordances (disabled); only Send is wired.
 */
export function ChatInputBox({
  value,
  onChange,
  onSend,
  placeholder = "Ask anything about the business…",
  size = "lg",
}: ChatInputBoxProps) {
  return (
    <div className="rounded-2xl border bg-secondary p-1 dark:bg-card">
      <div className="rounded-xl border bg-card dark:border-transparent dark:bg-secondary">
        <Textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          className={
            "resize-none border-0 bg-transparent px-4 py-3 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 " +
            (size === "lg" ? "min-h-[112px]" : "min-h-[72px]")
          }
        />

        <div className="flex items-center justify-between gap-2 border-t border-border/60 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled
              aria-label="Attach (prototype)"
              className="size-7 rounded-full border bg-card dark:bg-secondary"
            >
              <Paperclip className="size-4 text-muted-foreground" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled
              className="h-7 gap-1.5 rounded-full border bg-card px-3 dark:bg-secondary"
            >
              <CircleDashed className="size-4 text-muted-foreground" />
              <span className="hidden text-xs text-muted-foreground sm:inline">Deep search</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled
              className="h-7 gap-1.5 rounded-full border bg-card px-3 dark:bg-secondary"
            >
              <Sparkles className="size-4 text-muted-foreground" />
              <span className="hidden text-xs text-muted-foreground sm:inline">Think</span>
            </Button>
          </div>

          <Button
            type="button"
            size="sm"
            className="h-7 gap-1.5 px-3"
            disabled={!value.trim()}
            onClick={onSend}
          >
            Send
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
