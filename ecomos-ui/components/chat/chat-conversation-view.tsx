"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Conversation } from "@/data/chat";
import { ChatMessage } from "./chat-message";
import { ChatInputBox } from "./chat-input-box";

interface ChatConversationViewProps {
  conversation: Conversation;
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function ChatConversationView({
  conversation,
  value,
  onChange,
  onSend,
}: ChatConversationViewProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [conversation.messages.length]);

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="mx-auto max-w-[680px] space-y-6 px-4 py-8 md:px-8">
          {conversation.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>

      <div className="border-t px-4 py-4 md:px-8">
        <div className="mx-auto max-w-[680px]">
          <ChatInputBox
            value={value}
            onChange={onChange}
            onSend={onSend}
            size="md"
            placeholder="Continue the conversation…"
          />
        </div>
      </div>
    </div>
  );
}
