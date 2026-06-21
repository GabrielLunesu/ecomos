# Ecom-OS UI prototype — implementation notes

UI-only prototype. **No backend, database, auth, Hermes, Composio, Shopify, or
real money-touching actions.** Everything renders from deterministic TypeScript
fixtures; all writes, sends, and model responses are simulated.

Branch: `ui/ecomos-ui-foundation` · App: `ecomos-ui/`

---

## What was built

### Foundation
- **Next.js 16 App Router + React 19 + TypeScript strict + Tailwind 4**, shadcn
  `new-york`, neutral **OKLCH tokens**, dark-first with light-mode parity,
  Lucide icons, `next-themes` (no FOUC), Sonner toasts.
- **Design tokens** (`app/globals.css`): neutral surfaces + a **centralized
  semantic status palette** (success / warning / critical / info / agent +
  surfaces) and a 6-colour semantic chart series. No inline status colours
  anywhere — everything maps through `components/feedback/status.tsx`.
- **Formatting** (`lib/formatting`): currency / percent / number / compact /
  date / relative-time / duration, all computed against a single deterministic
  `REFERENCE_NOW` (2026-06-20T09:00+02:00). Fixtures stay numeric/ISO until
  formatted.

### Navigation contract (single source of truth)
- `config/routes.ts` — typed registry of **every route** in the IA map (path,
  label, title, operator-question description, icon, section, parent, optional
  feature, build status) + helpers (`resolveActiveRoute`, `getBreadcrumbs`,
  `getChildren`).
- `config/navigation.ts` — sidebar tree derived from the registry. Active state,
  breadcrumbs, page titles, and the command palette all derive from this.

### Application shell
- `AppShell` (inset bordered canvas), route-driven `AppSidebar` (label
  navigates + expands, **chevron only toggles**, active state from the URL,
  active department auto-expands, collapsed icon mode, mobile Sheet, inventory
  hidden via `brand.inventoryEnabled`), `GlobalHeader` (stable 52px), breadcrumb,
  search→command-palette, presence cluster (people + agents), notifications
  popover, **scenario switcher**, theme toggle,
  profile + **role-preview** menu, `BrandContextSwitcher` (brand + store scope,
  not tenant switching), sidebar system-status footer, `GlobalStateBanner`
  (incident/partial/stale/offline + the simulation notice).
- `CommandPalette` (Cmd/Ctrl+K and `/`): navigate, seeded record search,
  actions, scenario switching.
- `PageHeader` — the one heading contract (eyebrow, title, purpose, freshness/
  context meta, primary/secondary/overflow actions, tabs).

### Scenario engine
- `data/scenario.ts` + `data/scenario-store.ts` (Zustand, persisted): 7
  scenarios (healthy / attention / incident / empty / partial / stale / offline),
  6 role previews, store scope, density, palette open state, and **simulated
  mutation overlays** (approvals, task/ticket status, acknowledged alerts,
  schedules, replies, quality verdicts) with reset.
- `?scenario=` is shareable via `ScenarioUrlSync`.

### Seed data (`data/`) — deterministic, cross-linked
- `schema/` — full typed domain model (brand, commerce, finance, CS, marketing,
  operations, agents/traces, knowledge, activity, shared vocab).
- `base/` — canonical **Northstar Goods** brand: 2 stores, channels, team;
  products, suppliers (incl. Aurora Supply), customers, **orders** with full
  margin inputs, tickets + messages, automations, prompts, quality, campaigns/
  creatives/audiences, operations (fulfilment, returns, scorecards, inventory,
  exceptions), agents/schedules/memory, runs + tool calls + actions, **7 trace
  exemplars**, activity events, alerts/insights, approvals, tasks, knowledge
  docs/SOPs/research.
- `scenarios/` — declarative per-scenario configs + `getScenarioData()` that
  transforms base records (e.g. `empty` → nothing; `partial` → strips a COGS
  cohort + stale Meta; `incident` → activates the Aurora cascade).
- `selectors/` — pure `(scenario, storeScope) =>` functions that **reconcile
  totals from records**: command-center, finance, customer-service, activity,
  table rows, nav badges.
- `validate.ts` — 40 integrity checks (id resolution, uniqueness, margin
  reconciliation across all scenarios, trace stage ordering, no secrets).
  Run: `npm run check:fixtures`.

### Shared component library (`components/`)
- **metrics**: `MetricSummary` (+ `TrendBadge`), `MetricStrip`, `MetricExplanation`.
- **charts**: `TimeSeriesChart` (semantic series, empty state), `ProfitBridge`.
- **data-table**: composable TanStack `DataTable` (search, sort, pagination,
  row click, loading/empty states).
- **page**: `Panel`, `AttentionPanel`, `RankedList`, `SourceHealthPanel`.
- **records**: `EntityLink` (per-kind icon + route).
- **trace**: `TraceTimeline`, `ApprovalCard`, `ActivityTimeline`.
- **feedback**: `StatusBadge`/`StatusDot`, `ActorBadge`, `FreshnessIndicator`,
  `EmptyState` (5 variants), `ErrorState`, `LoadingState`, `StateBanner`,
  `InlineMessage`, `SimulationBadge`.
- **forms**: `ConfirmActionDialog` (review → progress → success/failed/uncertain).
- All generic components take typed props; none import scenario fixtures.

### Pages
- **Fully built overviews**: `/command-center`, `/finance`,
  `/customer-service`, `/activity` — each answers its operator question with
  real selector data, attention-first composition, drill-downs, and empty-state
  handling. Plus the full-page **`/chat`** Ask Ecom-OS surface (conversation
  management — new / rename / archive / delete, welcome screen, citations) and
  the **`/design-system`** gallery (every component + states, with theme toggle).
- **61 scaffolded routes** for the rest of the approved map — navigable,
  route-metadata-driven `PageHeader`, honest "scaffolded" panel with sibling
  navigation.

---

## Validation

| Check | Command | Result |
|---|---|---|
| Types | `npm run typecheck` | 0 errors |
| Lint | `npm run lint` | 0 errors, 1 warning* |
| Build | `npm run build` | ✓ 69/69 static pages |
| Fixtures | `npm run check:fixtures` | ✓ 40/40 checks |

\* The one warning is React Compiler skipping memoization of TanStack Table's
`useReactTable` (`react-hooks/incompatible-library`) — expected and harmless.

## Run locally
```bash
cd ecomos-ui
npm install
npm run dev      # http://localhost:3000/command-center
npm run build && npm run check:fixtures
```
Try `?scenario=incident` (or the header scenario switcher) to propagate the
supplier incident across Command Center, Finance, CS, and Activity.

---

## Design decisions / deviations
- **Core items are flat sidebar shortcuts** (Command Center, Inbox, My Tasks)
  with badges; their subpages are routes + future in-page tabs, not sidebar
  children. Departments / Intelligence / System are expandable with an Overview
  first child. (Resolves an open IA decision; revisit in product review.)
- **`/chat` and `/design-system` live outside the workspace shell** (per the
  required folder structure) with their own minimal chrome.
- **Ask Ecom-OS is a single full-page surface, not a side panel.** Launched
  from the **topmost item in the workspace sidebar** (and the command palette);
  the former right-side Ask panel and header button were removed. `/chat` now
  carries its own conversation-list sidebar (Recent / Archived, per-item rename /
  archive / delete) backed by `data/chat-store.ts` (in-memory, deterministic
  seed). This **deviates from INFORMATION-ARCHITECTURE.md**, which still
  describes a persistent side panel *and* a full page — flag for product review
  to update the spec.
- **Multi-currency** is summed numerically and presented as EUR for "all
  stores" (single-store uses its own currency). A real build would FX-normalise;
  noted in `data/selectors/helpers.ts`.
- Marketing/Commerce/Operations/Agents/Knowledge/Settings overviews are
  scaffolded placeholders this slice (see below).
- Removed `dashboard-inspo/node_modules` during a disk-space incident — that
  only deletes reinstallable deps; the frozen reference source is untouched.

## Known gaps / next build slice (recommended order)
1. **RecordDrawer journeys** — order/ticket/run detail drawers + `DetailTabs`,
   `RelationshipList`, `ToolCallCard`, `EvidenceList`, `ActionStateStepper`
   (the trace components exist; wire them into drawers).
2. **Dataset pages** on the built `DataTable`: `/commerce/orders`,
   `/customer-service/tickets`, `/marketing/campaigns`, `/agents/runs` (selectors
   already provide rows) with cell renderers and saved views.
3. **Inbox + Approvals** using `ApprovalCard` + the overlay store (wire
   approve/reject → activity append).
4. Remaining department overviews (Marketing, Commerce, Operations, Agents,
   Knowledge) and Settings/integrations states.
5. Per-route scenario state coverage pass (loading/error/read-only) and a
   visual/responsive review against `dashboard-inspo/`.
6. Optional: chart wrappers for distribution/waterfall-via-recharts; a few
   Vitest tests for route config + selectors.

## Boundaries respected
No backend/API/db/auth/Hermes/Composio/Shopify, no real money actions, no
imports from any old repo, no runtime imports from `dashboard-inspo/`,
`dashboard-inspo/` source untouched, typed deterministic fixtures only.
