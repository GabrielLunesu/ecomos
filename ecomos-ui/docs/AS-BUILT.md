# Ecom-OS — As-built vs. product-docs

This documents the **current `ecomos-ui/` implementation** and how it diverges
from the original planning spec in `product-docs/`. The product-docs remain the
planning baseline; this file is the source of truth for *what actually exists*
and *why it differs*.

> Relationship to `dashboard-inspo/`: that frozen Square/lndev-ui template was a
> **visual reference only**. Nothing is imported from it at runtime, and its
> `node_modules` was removed during a disk incident (reinstallable; source
> untouched). The Linear-style task board was adapted from a second reference,
> `tasks-inspo/` (also reference-only).

---

## 1. Stack (as built)

- **Next.js 16 App Router**, React 19, **TypeScript strict**, Tailwind CSS 4.
- shadcn **new-york** primitives, neutral **OKLCH tokens**, dark-first + light parity, `next-themes`.
- **Zustand** for all local state (scenario, tasks board, chat). No backend, DB, auth, or model calls — everything is deterministic fixtures + simulated writes.
- Lucide icons · Recharts (chart wrappers) · TanStack Table (DataTable) · cmdk (command palette) · vaul/sonner · **motion** (added — see §7).
- **Vendored component registries:** `uilayouts` (liquid-gradient brand mark) and **AI Elements** (`reasoning`, `chain-of-thought`, `task`) under `components/uilayouts/` and `components/ai-elements/` — installed via their CLIs, not hand-authored (added `radix-ui`, `streamdown`).
- Validation: `npm run typecheck` · `npm run lint` · `npm run build` · `npm run check:fixtures` (40 integrity checks).

---

## 2. Page inventory (what's real vs scaffolded)

Every route in the approved IA map is **navigable**. Status today:

**Fully built**
- `/command-center` — attention-first overview (pulse KPIs, trend chart directly under KPIs, attention queue, department health, activity, priorities).
- `/finance` — explainable contribution-margin breakdown, profit bridge, source health, trend, drivers.
- `/customer-service` — CS health, automation rate, topic distribution, risk queue, workload.
- `/activity` — unified activity timeline with actor filters + a featured agent trace.
- `/tasks` — **Linear-style kanban board** (see §6) — drag between columns, per-person scope, sub-todos, detail sheet.
- `/chat` — full Ask Ecom-OS surface (welcome screen, conversation list with new/rename/archive/delete, citations) — **now inside the workspace shell**. Assistant answers show **collapsible Reasoning ("thinking")** and a **Chain-of-Thought step list** (AI Elements — see §5).
- `/design-system` — component gallery across states/themes (top-level, outside the workspace shell).

**Scaffolded placeholders** (route-driven `PlaceholderPage`, navigable, honest "planned" panel + sibling links): all remaining department subpages and overviews — Marketing, Commerce, Operations, Agents, Knowledge, Settings (+ their subpages), Inbox (+ subpages), Tasks subpages, Command-Center subpages, Finance/CS/Activity subpages.

---

## 3. Architecture — how it's built

- **Route contract** (`config/routes.ts`): one typed registry of every route (path, label, title, operator-question description, icon, section, parent, optionalFeature, `build` status). Helpers: `resolveActiveRoute`, `getBreadcrumbs`, `getChildren`. Active state, breadcrumbs, titles, and the command palette all derive from this — no hard-coded `isActive`, no `href="#"`.
- **Navigation tree** (`config/navigation.ts`): sidebar model derived from the registry. Core items are flat; Departments/Intelligence/System are expandable.
- **Scenario engine** (`data/scenario.ts`, `data/scenario-store.ts`): 7 scenarios (healthy / attention / incident / empty / partial / stale / offline), 6 role previews, analysis **period** + compare-toggle, density, command-palette state, and simulated-mutation overlays — all persisted; `?scenario=` is shareable.
- **Seed data** (`data/`): typed `schema/` → canonical `base/` fixtures → `scenarios/` overlays (`getScenarioData`) → pure `selectors/` that **reconcile every total from records**. `data/validate.ts` asserts integrity.
- **Components** (by layer): `ui/` (28 shadcn primitives) → `feedback/` `metrics/` `charts/` `data-table/` `records/` `trace/` `page/` `forms/` (Ecom-OS patterns) → `shell/` `navigation/` `chat/` `domain/tasks/` `brand/` `uilayouts/` (compositions). Generic components take typed props; none import scenario fixtures.

---

## 4. Deviations from product-docs (changed / removed)

### Single-store (biggest change)
**Spec:** `SEED-DATA-CONTRACT.md` + `INFORMATION-ARCHITECTURE.md` modelled one brand with **multiple stores** (Northstar Home EU / Northstar Living UK) and an "All stores ↔ named store" scope switcher.
**As built:** Ecom-OS is **single-store**. One store (`Northstar Goods`, EUR). Removed:
- the store-scope switcher in the sidebar brand control,
- `storeScope`/`setStoreScope` from the scenario store,
- the "All stores" chip in the global header,
- the second store + all GBP data (orders/products/customers/payouts are single-store EUR).

Selectors keep a vestigial `"all"` scope arg (single store ⇒ "all" = the one store) so signatures didn't churn.

### No "Overview" submenu items
**Spec:** `NAVIGATION-AND-SHELL.md` / `INFORMATION-ARCHITECTURE.md` — "Overview" is the first submenu item of each department, pointing at the department root.
**As built:** the redundant "Overview" item is **removed**. The department **root is the top page** (reached by clicking the department label, which also expands it); the submenu lists only the real subpages.

### Page identity lives in the topbar, not an in-content heading band
**Spec:** `NAVIGATION-AND-SHELL.md` — every page opens with a `PageHeader` block (title, description, freshness meta, actions).
**As built:** the **single command bar** carries route path + a compact freshness icon (details in a popover). Built pages drop the in-content heading band entirely — content starts directly under the bar. Page-specific actions move into the relevant panel (e.g. Finance "Export") or the global Ask launcher; redundant per-page "Ask about X" actions removed. (`PageHeader`/`PageContextMeta` still exist for placeholders/future use.)

### Global analysis window (date control) is real and drives data
**Spec:** date range was page-scoped, described but not wired.
**As built:** a global **date-range control + "compare to previous period" toggle** in the header. `period` lives in the scenario store; `selectCommandCenter`/`selectFinanceOverview` **window orders by period and compute "vs previous period" deltas from the actual windows** (not hard-coded).

### Ask Ecom-OS: full page instead of a persistent side panel
**Spec:** `NAVIGATION-AND-SHELL.md` described a persistent right-side Ask panel **and** a `/chat` page.
**As built:** the side panel was dropped in favor of a full **`/chat`** experience inside the workspace, reached via a header **"Chats" button** and the sidebar **Ask Ecom-OS** launcher. (A standalone `AskPanel` component was built earlier and removed from the shell.)

### Core vs department nav split
**As built decision** (resolves an open IA question): Command Center, Inbox, My Tasks are **flat** sidebar shortcuts with badges; their subpages are routes/tabs, not sidebar children. Departments/Intelligence/System are expandable.

### Seed-data specifics
- Orders spread across **~180 days** (~146 orders) so 7/30/90-day windows and their previous periods are all populated → realistic deltas.
- The **missing-COGS cohort** (partial scenario) = the 42 most-recent orders, **decoupled** from the incident.
- The **Aurora supplier incident** cohort only exists in the `incident` scenario; other scenarios drop it so it doesn't distort trends.

---

## 5. Things added beyond the spec

- **Tasks board** (`/tasks`) — see §6.
- **ecomOS liquid-gradient logo** — `components/brand/ecomos-logo.tsx` over the official `components/uilayouts/liquid-gradient.tsx` (installed via `npx uilayouts add liquid-gradient`, pulls in `motion`). Text-only "ecomOS" on a deep-blue base with a brand-blue liquid; placed in the **sidebar footer** and the **chat conversation-list header**.
- **Motion / view transitions** — `motion` dependency, `experimental.viewTransition` in `next.config.ts`, and motion duration/easing tokens in `globals.css` (`--motion-*`, `.motion-full`).
- **Centralized semantic status system** — `components/feedback/status.tsx` + tokens; status `*-foreground` retuned to be legible **on the soft `*-surface` chips** in both themes (fixed a light-mode contrast bug).
- **Command palette** (⌘K / `/`), scenario switcher, role preview, presence cluster, notifications — all in the shell.
- **AI Elements in `/chat`** — installed via `npx ai-elements add reasoning | chain-of-thought | task` into `components/ai-elements/`. Assistant messages render a **Reasoning** disclosure (deterministic "thinking" + duration) and a **Chain-of-Thought** step list ("How I got here"); both seeded in `data/chat.ts` and produced by the store's `simulatedReply`. This makes Ask Ecom-OS reasoning *visible and inspectable* — consistent with the "agents are visible participants / traceability is part of the primary experience" principles. The `task` component is installed for agent/step surfaces. **No real model calls** — reasoning/steps are fixtures.
  - Deps pulled in: `motion`, `radix-ui` (unified package), `streamdown`. The installs **overwrote `components/ui/badge.tsx` and `collapsible.tsx`**; the badge now uses `radix-ui` + a pill shape, and our **semantic variants (success/warning/critical/info/agent/neutral) were re-added** on top so existing chips keep working.

---

## 6. Tasks board (`/tasks`) — adapted from `tasks-inspo`

Linear-style board, rebuilt with our primitives + our team as the people:
- **6 status columns** (Backlog, Todo, In Progress, Technical Review, Paused, Completed) with circular status glyphs.
- **Native drag-and-drop** between columns (updates status + appends a timeline entry); column drop-highlight.
- **Per-person scope** — avatar chips filter the whole board to one assignee.
- **Card** — status glyph, title, priority glyph, description, labels, due/comments/attachments/links chips, **sub-task progress ring**, assignee avatars.
- **Detail sheet** (new — not in the inspo): assigned-to (+ tag people), **sub-todos** (checkable, with add; drives the progress ring), due date, status change, labels, attachments, **timeline/activity**, comment composer.
- State: dedicated in-memory store (`data/tasks-board-store.ts`); resets on reload.

This supersedes the `PAGE-BLUEPRINTS.md` My-Tasks (List/Board/Today) sketch.

---

## 7. Known gaps / next slices

1. RecordDrawer journeys (order/ticket/run detail) wiring the existing trace components.
2. Dataset pages on the `DataTable` (`/commerce/orders`, `/customer-service/tickets`, `/marketing/campaigns`, `/agents/runs`) — selectors already provide rows.
3. Inbox + Approvals wired to the overlay store.
4. Remaining department overviews (Marketing, Commerce, Operations, Agents, Knowledge) + Settings states.
5. Per-route loading/error/read-only scenario coverage pass; a few Vitest tests for route config + selectors.

---

## 8. Boundaries upheld

No backend/API/DB/auth/Hermes/Composio/Shopify, no real money actions, no imports from any old repo, no runtime imports from `dashboard-inspo/`, typed deterministic fixtures only, no real customer data/credentials.
