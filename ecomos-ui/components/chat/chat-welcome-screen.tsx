"use client";

import { BRAND } from "@/data/base/brand";
import { ChatInputBox } from "./chat-input-box";

const SUGGESTED = [
  "What changed since yesterday?",
  "Why is contribution margin down?",
  "Which orders are affected by the supplier delay?",
  "Compare campaign ROAS",
];

interface ChatWelcomeScreenProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onPick: (prompt: string) => void;
}

export function ChatWelcomeScreen({ value, onChange, onSend, onPick }: ChatWelcomeScreenProps) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center px-4 md:px-8">
      <div className="-mt-10 w-full max-w-[640px] space-y-8">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">Ask Ecom-OS</h1>
            <p className="text-base text-muted-foreground">
              Ask anything about {BRAND.name} — margin, orders, campaigns, agents, or what needs your attention.
            </p>
          </div>
        </div>

        <ChatInputBox value={value} onChange={onChange} onSend={onSend} size="lg" />

        <div className="flex flex-wrap items-center justify-center gap-2">
          {SUGGESTED.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onPick(prompt)}
              className="rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <p className="absolute bottom-5 text-center text-xs text-muted-foreground">
        Prototype · responses and citations are deterministic fixtures.
      </p>
    </div>
  );
}
