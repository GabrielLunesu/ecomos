# UI-only prototype build plan

## Build rule

No backend, database, Hermes, connector, authentication, or business-execution logic is added during this plan. The prototype is allowed to contain local state and deterministic calculations required to make the interface realistic.

## New application

Create a new root folder:

```text
ecomos-ui/
```

Keep `dashboard-inspo/` frozen as a comparison source.

Recommended initial stack:

- Next.js App Router;
- React and TypeScript strict mode;
- Tailwind CSS 4;
- Radix primitives and shadcn-style components;
- next-themes;
- Lucide;
- TanStack Table;
- Recharts behind owned wrappers;
- Zustand for scenario and local prototype state;
- Vitest + Testing Library;
- Playwright or Cypress for a small set of navigation/journey checks;
- Storybook is optional; an internal `/design-system` route may be faster for this phase.

Pin exact versions in the lockfile once scaffolded.

## Phase 0 — Product review

Before application generation:

- review route map;
- review department/subpage names;
- resolve or explicitly defer open decisions in `INFORMATION-ARCHITECTURE.md`;
- confirm fictional brand and stores;
- confirm dark-first visual direction with full light-mode parity;
- verify inspiration-source license.

Output: approved product-doc commit.

## Phase 1 — Scaffold and tokens

Create the new app without copying the old frontend.

Deliver:

- Next.js project;
- lint/typecheck/test scripts;
- theme provider without FOUC;
- semantic token file;
- typography and number styles;
- primitive component baseline;
- icon policy;
- internal design-system route;
- simulation notice and scenario switcher.

Acceptance:

- dark/light/system themes;
- keyboard-visible focus;
- 320px and wide desktop render;
- no remote API request required to load;
- no imports from `dashboard-inspo/`.

## Phase 2 — Shell and navigation

Deliver:

- AppShell;
- route-driven sidebar;
- department submenus;
- mobile navigation Sheet;
- brand/store context switcher;
- global header;
- PageHeader;
- command palette shell;
- Ask Ecom-OS panel shell;
- route placeholders for the full map;
- breadcrumbs and active states from one typed config.

Acceptance:

- every route navigable;
- clicking a department label opens its overview and submenu;
- clicking chevron only toggles;
- active child remains visible;
- collapsed sidebar and mobile Sheet work;
- page state survives opening/closing Ask panel;
- keyboard navigation and focus restoration work.

## Phase 3 — Seed-data foundation

Deliver:

- typed domain schemas;
- coherent fictional brand;
- base entity fixtures;
- scenario overlays;
- selectors/calculations;
- scenario store and reset;
- integrity tests.

Acceptance:

- cross-entity IDs resolve;
- finance summaries reconcile to seeded records;
- incident propagates across pages;
- deterministic timestamps/reference date;
- no page-owned conflicting totals.

## Phase 4 — Shared operational components

Deliver:

- metric summary/strip/explanation;
- status, actor, freshness, and data-quality indicators;
- Panel and AttentionPanel;
- chart wrappers and semantic tooltip;
- DataTable system and mobile renderer;
- RecordDrawer;
- ActivityTimeline;
- TraceTimeline;
- ApprovalCard;
- loading/empty/error/stale components;
- common forms and confirmation patterns.

Acceptance:

- components demonstrated in `/design-system`;
- both themes and responsive states;
- no generic component imports fixtures directly;
- semantic status mapping centralized;
- table and chart accessibility basics documented and tested.

## Phase 5 — Core journeys first

Build complete vertical UI journeys before filling every route.

### Journey A: Morning review

Command Center → Daily Brief → finance issue → affected orders → create task → Ask Ecom-OS.

### Journey B: Customer-service exception

Inbox → ticket drawer → order context → trace → approval simulation → updated timeline.

### Journey C: Agent accountability

Agents → failed run → trace → affected ticket/order → follow-up task.

### Journey D: Operations incident

Operations Exceptions → supplier delay → affected orders/tickets → impact summary.

Acceptance:

- routes, drawers, dialogs, local mutations, activity updates, citations, and back-navigation feel coherent;
- journeys work by mouse and keyboard;
- mobile journey remains understandable.

## Phase 6 — Complete page map

Implement remaining routes using the approved blueprints. Do not duplicate page structures mechanically. Each department overview must answer a distinct operational question.

Suggested order:

1. Command Center and Inbox
2. Customer Service
3. Finance
4. Commerce
5. Operations
6. Agents and Activity
7. Marketing
8. Tasks
9. Knowledge
10. Settings and full Chat

## Phase 7 — State completeness

For every core route, implement scenario previews for:

- healthy;
- attention;
- empty;
- partial/stale;
- error/degraded;
- read-only/unauthorized.

Review high-volume and long-text states. Confirm no page becomes unusable when data is incomplete.

## Phase 8 — Visual and interaction review

Review against `dashboard-inspo/` for discipline, not literal similarity.

Check:

- shell proportions;
- sidebar density;
- border/surface hierarchy;
- typography;
- chart readability;
- table density;
- semantic color use;
- light/dark parity;
- mobile recomposition;
- focus and keyboard behavior;
- motion/reduced motion;
- all controls useful or explicitly disabled.

Capture screenshots for key routes/scenarios at desktop and mobile widths.

## Phase 9 — Prototype freeze

Before any backend integration:

- resolve critical UX findings;
- freeze route IDs and primary entity/detail contracts;
- document fixture-to-future-API boundaries;
- record which interactions need real backend commands;
- identify data not yet available in the existing implementation;
- approve prototype version/tag.

The frozen prototype becomes the contract used to reshape existing backend logic.

## Directory proposal

```text
ecomos-ui/
├── app/
│   ├── (workspace)/
│   ├── chat/
│   └── design-system/
├── components/
│   ├── ui/
│   ├── shell/
│   ├── navigation/
│   ├── page/
│   ├── metrics/
│   ├── charts/
│   ├── data-table/
│   ├── records/
│   ├── trace/
│   ├── feedback/
│   ├── forms/
│   └── domain/
├── config/
│   ├── navigation.ts
│   └── routes.ts
├── data/
│   ├── schema/
│   ├── base/
│   ├── scenarios/
│   ├── selectors/
│   └── scenario-store.ts
├── lib/
│   ├── formatting/
│   ├── accessibility/
│   └── utils.ts
├── tests/
└── public/
```

## Rules for implementation agents

- Read all `product-docs/` files before editing.
- Do not touch `dashboard-inspo/` except for license notes.
- Do not import from the old eComOS frontend/repo.
- Do not add backend/API placeholders that silently become architecture.
- Do not create fake hooks named like real integrations; use explicit fixture selectors.
- Do not repeat inline status colors.
- Do not hard-code active navigation.
- Do not build one route while leaving the shell unstable.
- Do not run many agents against the same UI files in parallel.
- Prefer one UI owner with focused review agents or strictly isolated component/page scopes.
- Maintain a short living product doc for unresolved decisions and discovered edge cases.

## Recommended execution model

The earlier ten-agent parallel approach is not appropriate for the first UI foundation because shell, tokens, navigation, tables, and page composition are tightly coupled.

Use at most:

1. **UI lead** — shell, tokens, architecture, integration.
2. **Component-system agent** — shared components and design-system route.
3. **Seed-data agent** — schemas, scenarios, selectors, integrity tests.
4. **Page-composition agent** — one approved department at a time after shared foundation.
5. **UX reviewer** — read-only review, screenshots, findings.

Do not launch all five until the scaffold and shell contract are stable. UI quality benefits more from coherence than maximum parallelism.

## Final prototype acceptance checklist

### Product

- [ ] Approved route and submenu structure
- [ ] Core journeys complete
- [ ] Every page has a defined operator question
- [ ] No decorative-only overview
- [ ] Summaries drill down
- [ ] Traceability appears in normal workflows

### Visual

- [ ] Matches reference quality and density
- [ ] Distinct Ecom-OS identity
- [ ] Dark/light parity
- [ ] Responsive compositions reviewed
- [ ] Semantic color and typography consistent

### Interaction

- [ ] Mouse and keyboard navigation
- [ ] Mobile Sheet navigation
- [ ] Drawers/dialogs/focus restoration
- [ ] Ask panel preserves context
- [ ] Search/filter/sort/selection usable
- [ ] Simulated writes update visible state and activity

### States

- [ ] Loading
- [ ] Healthy
- [ ] Attention/incident
- [ ] Empty/no results
- [ ] Partial/stale
- [ ] Error/degraded
- [ ] Read-only/unauthorized

### Technical boundary

- [ ] No backend/API calls
- [ ] No database/migrations
- [ ] No Hermes/model calls
- [ ] No real credentials or customer data
- [ ] Typed deterministic fixtures
- [ ] No runtime imports from `dashboard-inspo/`
- [ ] Tests for route config and fixture integrity

Only after all checked items are reviewed should real application logic be integrated.