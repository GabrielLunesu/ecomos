"use client";

import * as React from "react";
import {
  Archive,
  ArchiveRestore,
  Banknote,
  Megaphone,
  MessageCircle,
  MoreVertical,
  Pencil,
  Plus,
  Route,
  Search,
  Share2,
  Sunrise,
  Trash2,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/data/chat-store";
import type { Conversation, ConversationIcon } from "@/data/chat";

const ICON_MAP: Record<ConversationIcon, React.ComponentType<{ className?: string }>> = {
  margin: Banknote,
  recap: Sunrise,
  trace: Route,
  campaign: Megaphone,
  operations: Truck,
  message: MessageCircle,
};

export function ChatConversationList({ onNavigate }: { onNavigate?: () => void }) {
  const {
    conversations,
    activeId,
    selectConversation,
    newConversation,
    renameConversation,
    archiveConversation,
    unarchiveConversation,
    deleteConversation,
  } = useChatStore();

  const [query, setQuery] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const filtered = query.trim()
    ? conversations.filter((c) => c.title.toLowerCase().includes(query.trim().toLowerCase()))
    : conversations;
  const recent = filtered.filter((c) => !c.isArchived);
  const archived = filtered.filter((c) => c.isArchived);

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="space-y-2 border-b p-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={() => {
            newConversation();
            onNavigate?.();
          }}
        >
          <Plus className="size-4" /> New conversation
        </Button>
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations"
            className="h-8 pl-8 text-sm"
          />
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 p-3">
          <ConversationGroup
            label="Recent"
            conversations={recent}
            emptyLabel="No conversations yet"
            activeId={activeId}
            editingId={editingId}
            iconMap={ICON_MAP}
            onSelect={(id) => {
              selectConversation(id);
              onNavigate?.();
            }}
            onStartRename={setEditingId}
            onCommitRename={(id, title) => {
              renameConversation(id, title);
              setEditingId(null);
            }}
            onArchive={archiveConversation}
            onUnarchive={unarchiveConversation}
            onDelete={deleteConversation}
          />

          {archived.length > 0 && (
            <ConversationGroup
              label="Archived"
              conversations={archived}
              activeId={activeId}
              editingId={editingId}
              iconMap={ICON_MAP}
              onSelect={(id) => {
                selectConversation(id);
                onNavigate?.();
              }}
              onStartRename={setEditingId}
              onCommitRename={(id, title) => {
                renameConversation(id, title);
                setEditingId(null);
              }}
              onArchive={archiveConversation}
              onUnarchive={unarchiveConversation}
              onDelete={deleteConversation}
            />
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface ConversationGroupProps {
  label: string;
  conversations: Conversation[];
  emptyLabel?: string;
  activeId: string | null;
  editingId: string | null;
  iconMap: Record<ConversationIcon, React.ComponentType<{ className?: string }>>;
  onSelect: (id: string) => void;
  onStartRename: (id: string) => void;
  onCommitRename: (id: string, title: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onDelete: (id: string) => void;
}

function ConversationGroup({
  label,
  conversations,
  emptyLabel,
  activeId,
  editingId,
  iconMap,
  onSelect,
  onStartRename,
  onCommitRename,
  onArchive,
  onUnarchive,
  onDelete,
}: ConversationGroupProps) {
  return (
    <div className="space-y-1">
      <div className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
        {label}
      </div>
      {conversations.length === 0 && emptyLabel ? (
        <p className="px-2 py-1 text-xs text-muted-foreground">{emptyLabel}</p>
      ) : (
        conversations.map((conversation) => {
          const Icon = iconMap[conversation.icon] ?? iconMap.message;
          const isActive = activeId === conversation.id;
          const isEditing = editingId === conversation.id;

          return (
            <div
              key={conversation.id}
              className={cn(
                "group/item relative flex items-center rounded-md",
                isActive && "bg-sidebar-accent",
              )}
            >
              {isEditing ? (
                <RenameField
                  initial={conversation.title}
                  onCommit={(title) => onCommitRename(conversation.id, title)}
                  onCancel={() => onCommitRename(conversation.id, conversation.title)}
                />
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onSelect(conversation.id)}
                    className={cn(
                      "flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 pr-8 text-left text-sm transition-colors",
                      isActive ? "font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate">{conversation.title}</span>
                  </button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 size-7 opacity-0 transition-opacity group-hover/item:opacity-100 data-[state=open]:opacity-100"
                      >
                        <MoreVertical className="size-4" />
                        <span className="sr-only">Conversation actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" className="w-44">
                      <DropdownMenuItem disabled>
                        <Share2 className="size-4 text-muted-foreground" /> Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStartRename(conversation.id)}>
                        <Pencil className="size-4 text-muted-foreground" /> Rename
                      </DropdownMenuItem>
                      {conversation.isArchived ? (
                        <DropdownMenuItem onClick={() => onUnarchive(conversation.id)}>
                          <ArchiveRestore className="size-4 text-muted-foreground" /> Unarchive
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => onArchive(conversation.id)}>
                          <Archive className="size-4 text-muted-foreground" /> Archive
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={() => onDelete(conversation.id)}>
                        <Trash2 className="size-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

function RenameField({
  initial,
  onCommit,
  onCancel,
}: {
  initial: string;
  onCommit: (title: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = React.useState(initial);
  return (
    <Input
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onCommit(value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onCommit(value);
        } else if (e.key === "Escape") {
          e.preventDefault();
          onCancel();
        }
      }}
      className="h-8 text-sm"
    />
  );
}
