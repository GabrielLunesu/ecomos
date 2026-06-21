"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_PERIOD,
  DEFAULT_ROLE,
  DEFAULT_SCENARIO,
  type PeriodId,
  type RoleId,
  type ScenarioId,
} from "@/data/scenario";

export type Density = "comfortable" | "compact";

/**
 * Local simulated mutations. The real product would persist these through
 * backend commands; here they are in-memory overlays that selectors read so
 * the UI reflects simulated actions (and `reset()` restores deterministic state).
 */
export type Overlays = {
  /** approvalId -> decision */
  approvals: Record<string, "approved" | "rejected">;
  /** taskId -> status */
  taskStatus: Record<string, string>;
  /** acknowledged alert ids */
  acknowledgedAlerts: string[];
  /** ticketId -> status */
  ticketStatus: Record<string, string>;
  /** ticketId -> assignee id */
  ticketAssignee: Record<string, string>;
  /** scheduleId -> enabled */
  scheduleEnabled: Record<string, boolean>;
  /** simulated outbound replies appended to ticket timelines */
  replies: { id: string; ticketId: string; body: string; at: string }[];
  /** qualityReviewId -> verdict */
  qualityVerdicts: Record<string, string>;
};

const EMPTY_OVERLAYS: Overlays = {
  approvals: {},
  taskStatus: {},
  acknowledgedAlerts: [],
  ticketStatus: {},
  ticketAssignee: {},
  scheduleEnabled: {},
  replies: [],
  qualityVerdicts: {},
};

type ScenarioState = {
  scenario: ScenarioId;
  role: RoleId;
  period: PeriodId;
  compareToPrevious: boolean;
  density: Density;
  commandPaletteOpen: boolean;
  overlays: Overlays;

  setScenario: (s: ScenarioId) => void;
  setRole: (r: RoleId) => void;
  setPeriod: (p: PeriodId) => void;
  setCompareToPrevious: (v: boolean) => void;
  setDensity: (d: Density) => void;
  setCommandPaletteOpen: (open: boolean) => void;

  resolveApproval: (id: string, decision: "approved" | "rejected") => void;
  setTaskStatus: (id: string, status: string) => void;
  acknowledgeAlert: (id: string) => void;
  setTicketStatus: (id: string, status: string) => void;
  assignTicket: (id: string, assignee: string) => void;
  setScheduleEnabled: (id: string, enabled: boolean) => void;
  addReply: (ticketId: string, body: string, at: string) => void;
  setQualityVerdict: (id: string, verdict: string) => void;

  /** Restore deterministic state for the current scenario. */
  resetOverlays: () => void;
};

export const useScenarioStore = create<ScenarioState>()(
  persist(
    (set) => ({
      scenario: DEFAULT_SCENARIO,
      role: DEFAULT_ROLE,
      period: DEFAULT_PERIOD,
      compareToPrevious: true,
      density: "comfortable",
      commandPaletteOpen: false,
      overlays: EMPTY_OVERLAYS,

      setScenario: (scenario) => set({ scenario, overlays: EMPTY_OVERLAYS }),
      setRole: (role) => set({ role }),
      setPeriod: (period) => set({ period }),
      setCompareToPrevious: (compareToPrevious) => set({ compareToPrevious }),
      setDensity: (density) => set({ density }),
      setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),

      resolveApproval: (id, decision) =>
        set((s) => ({ overlays: { ...s.overlays, approvals: { ...s.overlays.approvals, [id]: decision } } })),
      setTaskStatus: (id, status) =>
        set((s) => ({ overlays: { ...s.overlays, taskStatus: { ...s.overlays.taskStatus, [id]: status } } })),
      acknowledgeAlert: (id) =>
        set((s) => ({
          overlays: {
            ...s.overlays,
            acknowledgedAlerts: s.overlays.acknowledgedAlerts.includes(id)
              ? s.overlays.acknowledgedAlerts
              : [...s.overlays.acknowledgedAlerts, id],
          },
        })),
      setTicketStatus: (id, status) =>
        set((s) => ({ overlays: { ...s.overlays, ticketStatus: { ...s.overlays.ticketStatus, [id]: status } } })),
      assignTicket: (id, assignee) =>
        set((s) => ({ overlays: { ...s.overlays, ticketAssignee: { ...s.overlays.ticketAssignee, [id]: assignee } } })),
      setScheduleEnabled: (id, enabled) =>
        set((s) => ({ overlays: { ...s.overlays, scheduleEnabled: { ...s.overlays.scheduleEnabled, [id]: enabled } } })),
      addReply: (ticketId, body, at) =>
        set((s) => ({
          overlays: {
            ...s.overlays,
            replies: [...s.overlays.replies, { id: `reply-${s.overlays.replies.length + 1}`, ticketId, body, at }],
          },
        })),
      setQualityVerdict: (id, verdict) =>
        set((s) => ({ overlays: { ...s.overlays, qualityVerdicts: { ...s.overlays.qualityVerdicts, [id]: verdict } } })),

      resetOverlays: () => set({ overlays: EMPTY_OVERLAYS }),
    }),
    {
      name: "ecomos-prototype",
      partialize: (s) => ({
        scenario: s.scenario,
        role: s.role,
        period: s.period,
        compareToPrevious: s.compareToPrevious,
        density: s.density,
      }),
    },
  ),
);
