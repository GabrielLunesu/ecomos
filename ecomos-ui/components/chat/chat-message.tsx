import Link from "next/link";
import { Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage as Message } from "@/data/chat";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought";

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const hasReasoning = !isUser && Boolean(message.reasoning);
  const hasSteps = !isUser && Boolean(message.steps?.length);

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-muted text-foreground" : "bg-agent-surface text-agent-foreground",
        )}
      >
        {isUser ? <User className="size-4" /> : <Sparkles className="size-4" />}
      </div>

      <div className={cn("min-w-0 space-y-2", isUser && "text-right")}>
        {/* Reasoning (collapsible "thinking") and chain-of-thought come before the answer. */}
        {hasReasoning && (
          <Reasoning className="w-full" defaultOpen={false} duration={message.reasoningSeconds}>
            <ReasoningTrigger />
            <ReasoningContent>{message.reasoning as string}</ReasoningContent>
          </Reasoning>
        )}

        {hasSteps && (
          <ChainOfThought defaultOpen={false}>
            <ChainOfThoughtHeader>How I got here</ChainOfThoughtHeader>
            <ChainOfThoughtContent>
              {message.steps!.map((step, i) => (
                <ChainOfThoughtStep
                  key={i}
                  label={step.label}
                  description={step.description}
                  status={step.status ?? "complete"}
                />
              ))}
            </ChainOfThoughtContent>
          </ChainOfThought>
        )}

        <div
          className={cn(
            "inline-block rounded-2xl px-4 py-2.5 text-left text-sm leading-relaxed",
            isUser ? "bg-primary text-primary-foreground" : "border bg-card",
          )}
        >
          {message.content}
        </div>

        {message.citations && message.citations.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.citations.map((c) => (
              <Link
                key={c.href + c.label}
                href={c.href}
                className="inline-flex items-center gap-1 rounded-md border bg-card px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <span className="size-1.5 rounded-full bg-info" />
                {c.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
