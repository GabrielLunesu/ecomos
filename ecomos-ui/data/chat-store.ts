"use client";

import { create } from "zustand";
import {
  SEED_CONVERSATIONS,
  type ChatCitation,
  type Conversation,
  type ConversationIcon,
} from "@/data/chat";

/**
 * Conversation management for the full-page Ask Ecom-OS surface.
 *
 * In-memory only: the seed conversations restore on reload so the prototype
 * stays deterministic. Replies are simulated fixtures with deterministic
 * citations — no model call (PAGE-BLUEPRINTS § Chat).
 */

type ChatState = {
  conversations: Conversation[];
  activeId: string | null;

  selectConversation: (id: string) => void;
  newConversation: () => void;
  /** Send a user message into the active conversation, creating one if needed. */
  send: (text: string) => void;
  renameConversation: (id: string, title: string) => void;
  archiveConversation: (id: string) => void;
  unarchiveConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
};

// Deterministic id generator (no Date.now / Math.random) so reruns are stable.
let counter = 0;
const nextId = (prefix: string) => `${prefix}-${(counter += 1)}`;

function titleFromMessage(text: string): string {
  const clean = text.trim().replace(/\s+/g, " ");
  return clean.length > 40 ? `${clean.slice(0, 40)}…` : clean;
}

/**
 * Deterministic simulated answer. Light keyword routing picks a relevant
 * citation so the demo links back into the matching department view.
 */
function simulatedReply(text: string): {
  content: string;
  citations: ChatCitation[];
  reasoning: string;
  reasoningSeconds: number;
  steps: { label: string; description?: string }[];
} {
  const q = text.toLowerCase();
  let citation: ChatCitation = { label: "Command Center", href: "/command-center" };
  if (/margin|profit|cogs|cost/.test(q)) citation = { label: "Finance overview", href: "/finance" };
  else if (/order|late|fulfil|ship|deliver|supplier/.test(q)) citation = { label: "Operations exceptions", href: "/operations/exceptions" };
  else if (/roas|spend|campaign|ad|meta|google/.test(q)) citation = { label: "Spend & ROAS", href: "/finance/spend-roas" };
  else if (/ticket|customer|cs|support|refund/.test(q)) citation = { label: "Customer Service", href: "/customer-service" };
  else if (/agent|trace|run|discount/.test(q)) citation = { label: "Agent traces", href: "/activity/agent-traces" };

  return {
    content:
      "This is a simulated answer grounded in deterministic seed data. In the built product this would cite the exact records used and link back into the relevant department view.",
    citations: [citation],
    reasoningSeconds: 3,
    reasoning:
      `Interpreting the question, choosing the relevant department data (${citation.label}), checking freshness, then composing a grounded answer with a citation. Responses are simulated in this prototype.`,
    steps: [
      { label: "Parsed the question and scope" },
      { label: `Selected source: ${citation.label}` },
      { label: "Composed a grounded, cited answer" },
    ],
  };
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: SEED_CONVERSATIONS,
  activeId: null,

  selectConversation: (id) => set({ activeId: id }),

  newConversation: () => {
    const id = nextId("conv");
    const conversation: Conversation = {
      id,
      title: "New conversation",
      icon: "message",
      messages: [],
      isArchived: false,
    };
    set((s) => ({ conversations: [conversation, ...s.conversations], activeId: id }));
  },

  send: (text) => {
    const q = text.trim();
    if (!q) return;

    const reply = simulatedReply(q);
    const userMsg = { id: nextId("msg"), role: "user" as const, content: q };
    const aiMsg = {
      id: nextId("msg"),
      role: "assistant" as const,
      content: reply.content,
      citations: reply.citations,
      reasoning: reply.reasoning,
      reasoningSeconds: reply.reasoningSeconds,
      steps: reply.steps,
    };

    const { activeId, conversations } = get();
    const active = activeId ? conversations.find((c) => c.id === activeId) : undefined;

    if (!active) {
      // No conversation yet — start one titled from the first message.
      const id = nextId("conv");
      const conversation: Conversation = {
        id,
        title: titleFromMessage(q),
        icon: "message" as ConversationIcon,
        messages: [userMsg, aiMsg],
        isArchived: false,
      };
      set((s) => ({ conversations: [conversation, ...s.conversations], activeId: id }));
      return;
    }

    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === active.id
          ? {
              ...c,
              // First real message names a freshly created conversation.
              title: c.messages.length === 0 ? titleFromMessage(q) : c.title,
              messages: [...c.messages, userMsg, aiMsg],
            }
          : c,
      ),
    }));
  },

  renameConversation: (id, title) =>
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === id ? { ...c, title: title.trim() || c.title } : c,
      ),
    })),

  archiveConversation: (id) =>
    set((s) => ({
      conversations: s.conversations.map((c) => (c.id === id ? { ...c, isArchived: true } : c)),
    })),

  unarchiveConversation: (id) =>
    set((s) => ({
      conversations: s.conversations.map((c) => (c.id === id ? { ...c, isArchived: false } : c)),
    })),

  deleteConversation: (id) =>
    set((s) => ({
      conversations: s.conversations.filter((c) => c.id !== id),
      activeId: s.activeId === id ? null : s.activeId,
    })),
}));
