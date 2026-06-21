"use client";

import * as React from "react";
import { useChatStore } from "@/data/chat-store";
import { ChatWelcomeScreen } from "./chat-welcome-screen";
import { ChatConversationView } from "./chat-conversation-view";

/**
 * The Ask Ecom-OS conversation area. Lives inside the workspace shell, so it
 * fills the page canvas and has no chrome of its own — conversation history is
 * reached from the "Chats" button in the global header.
 */
export function ChatPageClient() {
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeId);
  const send = useChatStore((s) => s.send);

  const [draft, setDraft] = React.useState("");

  const active = activeId ? conversations.find((c) => c.id === activeId) : undefined;
  const showWelcome = !active || active.messages.length === 0;

  const handleSend = (text: string) => {
    const q = text.trim();
    if (!q) return;
    send(q);
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col">
      {showWelcome ? (
        <ChatWelcomeScreen
          value={draft}
          onChange={setDraft}
          onSend={() => handleSend(draft)}
          onPick={handleSend}
        />
      ) : (
        <ChatConversationView
          conversation={active}
          value={draft}
          onChange={setDraft}
          onSend={() => handleSend(draft)}
        />
      )}
    </div>
  );
}
