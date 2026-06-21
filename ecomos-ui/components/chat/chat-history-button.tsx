"use client";

import * as React from "react";
import { MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChatConversationList } from "@/components/chat/chat-conversation-list";

/**
 * Chat-page-only header control. Opens conversation history in a centered modal
 * where the operator starts a new chat or reopens an old one.
 */
export function ChatHistoryButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5">
          <MessagesSquare className="size-3.5" />
          <span className="hidden text-xs sm:inline">Chats</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[70vh] max-h-[600px] flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="shrink-0 border-b px-4 py-3">
          <DialogTitle className="text-base">Chats</DialogTitle>
          <DialogDescription className="sr-only">
            Browse and manage your Ask Ecom-OS conversations.
          </DialogDescription>
        </DialogHeader>
        <ChatConversationList onNavigate={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
