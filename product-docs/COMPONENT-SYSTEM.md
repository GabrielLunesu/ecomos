# Ecom-OS component system

## Purpose

The prototype should look like one product even though its pages represent different departments. Reuse interaction contracts, not rigid page templates. Domain pages may compose components differently, but identical concepts should behave identically.

## Layer model

```text
Radix primitives
  ↓
shadcn-style UI primitives
  ↓
Ecom-OS patterns
  ↓
domain composites
  ↓
page compositions
```

Pages should not import directly from `dashboard-inspo/`.

## Foundation primitives

Use or adapt the existing shadcn-style primitives:

- Button
- Input / Textarea
- Select
- Checkbox / Radio group / Switch
- Dropdown menu / Context menu
- Popover
- Tooltip
- Dialog / Alert dialog
- Sheet / Drawer
- Tabs
- Collapsible
- Separator
- Avatar
- Badge
- Table
- Skeleton
- Command
- Scroll area
- Calendar / Date picker
- Toast or notification system

Every primitive must have documented focus, disabled, loading, error, and reduced-motion behavior.

## Application-shell components

### `AppShell`

Owns sidebar, header, page workspace, overlay portals, and Ask Ecom-OS panel state.

### `AppSidebar`

Consumes typed navigation configuration. It must not embed department-specific route logic in JSX.

### `BrandContextSwitcher`

Displays brand identity and current store scope. States: all stores, one store, unavailable store, degraded connections.

### `GlobalHeader`

Stable height and composition across routes.

### `PageHeader`

Props/concepts:

- icon;
- title;
- description;
- context/freshness metadata;
- primary action;
- secondary actions;
- overflow actions;
- tabs/saved view optional.

### `AskPanel`

Persistent context-aware mock chat surface.

### `CommandPalette`

Typed multi-entity search and route actions.

## Status language

Create one semantic status system instead of page-specific badge inventions.

### Status badge

Variants:

- neutral;
- info;
- in-progress;
- success;
- warning;
- critical;
- blocked;
- paused;
- awaiting approval;
- outcome uncertain;
- stale.

A status badge contains text and may contain an icon. Color alone is insufficient.

### Actor badge

Distinguishes:

- human;
- agent;
- system;
- connector;
- approval process.

### Freshness indicator

Shows:

- updated timestamp;
- source count;
- healthy/stale/partial/disconnected;
- open-source-details action.

### Confidence/data-quality indicator

Used only where uncertainty is real. Avoid fabricated precise percentages unless fixtures explain them. Prefer labels such as Confirmed, Estimated, Partial, Missing inputs.

## Metric components

### `MetricSummary`

For a primary value plus comparison and data status. It is not always a card.

Required fields:

- label;
- value;
- period;
- comparison value/direction;
- format;
- status/freshness;
- drill-down action;
- optional formula/provenance.

### `MetricStrip`

Compact row of related values. Appropriate for page summaries and drawers.

### `MetricExplanation`

Popover/drawer explaining formula, included/excluded components, source, freshness, and caveats.

### `ChangeDriverList`

Ranked positive/negative contributors with links to affected records.

## Panel components

### `Panel`

Standard surface with optional header, description, controls, body, footer, loading state, and error state.

### `AttentionPanel`

Higher-priority panel for exceptions. Uses severity sparingly and includes actionability.

### `RankedList`

Replacement for the reference Top Performers component. It supports semantic rows, value/progress, status, trend, and drill-down. Color/pattern depends on category or severity, not arbitrary rank decoration.

### `ActivityTimeline`

Mixed actor/event timeline with filtering and expandable detail.

### `SourceHealthPanel`

Connection/source freshness and missing-data summary.

## Charts

Create wrappers around Recharts rather than configuring every chart ad hoc.

### Shared chart contract

- semantic series IDs and labels;
- shared tooltip;
- shared axis and grid tokens;
- period control;
- series visibility control;
- empty/partial/stale/error states;
- accessible text summary;
- light/dark parity;
- responsive tick reduction;
- click/drill-down callback;
- comparison annotation support.

### Chart types

- Time series
- Stacked area/bar
- Waterfall/profit bridge
- Distribution
- Cohort/ageing bars
- Funnel
- Donut only when part-to-whole has few categories
- Heatmap only when labels remain legible

Avoid pie/donut charts for many categories and avoid unlabeled multi-series charts.

## Data-table system

The reference lead table demonstrates valuable interactions but is too page-specific. Build a composable system.

### `DataTable`

Capabilities:

- typed columns;
- search slot;
- filter definitions;
- sorting;
- pagination;
- row selection optional;
- column visibility;
- density setting;
- sticky header optional;
- saved-view selector;
- bulk-action bar only when meaningful;
- row click and row-action menu;
- loading/empty/error/stale states;
- mobile record-list renderer;
- keyboard row navigation.

### Cell patterns

- Entity cell with identifier and metadata
- Currency/number cell with tabular figures
- Status cell
- Actor/owner cell
- Trend cell
- Source/freshness cell
- Relationship/link cell
- Risk/attention cell
- Timestamp/duration cell
- Mini progress cell

Do not define status colors inline inside page files.

### Table toolbar

Standard order:

```text
Title / result count | Search | Filters | Saved view | Sort/columns | page actions
```

On mobile, keep search and the primary filter visible; move secondary controls to a Sheet.

## Record details

### `RecordDrawer`

Common structure:

1. Header: entity, identifier, status, actor/owner.
2. Summary metrics.
3. Main content tabs.
4. Relationships.
5. Activity/trace preview.
6. Actions.

### `EntityLink`

Consistent link/preview for order, customer, ticket, product, campaign, agent, run, action, document, and task.

### `RelationshipList`

Shows linked entities by type and provides navigation.

### `DetailTabs`

Recommended recurring tabs: Overview, Activity, Related, Sources, Trace. Domain tabs may replace these where clearer.

## Traceability components

### `TraceTimeline`

Stages:

- Trigger
- Context
- Evidence
- Decision/proposal summary
- Tool calls
- Approval/policy
- External result
- Final result

### `ToolCallCard`

Shows tool name, safe fixture arguments, timing, status, result summary, retries, and linked action. Never normalizes away errors or uncertainty.

### `ActionStateStepper`

Proposed → Authorized/Awaiting approval → Executing → Succeeded/Failed/Outcome uncertain → Reconciled.

### `EvidenceList`

Source name, excerpt/summary, timestamp, relevance, entity/document link.

### `ApprovalCard`

Exact proposed action, target, impact, evidence, policy comparison, requester, expiry, approve/reject actions, and history.

## Feedback and system states

### `InlineMessage`

Field or local validation.

### `StateBanner`

Page/panel degradation, stale data, disconnected source, or simulation notice.

### `EmptyState`

Variants:

- first-use setup;
- no matching results;
- genuinely zero activity;
- unavailable due to connection;
- hidden optional module.

### `ErrorState`

Includes what failed, impact, last-good availability, retry simulation, and technical-details disclosure where useful.

### `LoadingState`

Skeleton shape should match final composition. Avoid full-page spinners for normal loading.

### `SimulationBadge`

The UI-first prototype must clearly indicate that writes and model responses are simulated without placing a distracting badge on every component.

## Forms and action flows

Use consistent form sections, field descriptions, validation, and dirty-state handling.

Risk levels:

- low-risk local preference: immediate save or simple confirmation;
- operational assignment/state change: toast plus undo where possible;
- money/customer-facing action: review step showing exact target and consequence;
- destructive action: alert dialog requiring deliberate confirmation.

All are simulations in this phase.

## Page composition patterns

These are patterns, not templates:

### Attention-first overview

Attention queue → core metrics → primary analysis → department summaries → activity.

### Dataset workspace

Page header → saved views/toolbar → table → drawer.

### Investigation workspace

Summary → time series/drivers → related records → sources/freshness.

### Editor workspace

Left navigation/list → central editor/canvas → right inspector/test panel.

### Timeline workspace

Filters → grouped timeline → event/trace drawer.

### Knowledge workspace

Tree/list → document viewer/editor → metadata/backlinks panel.

## Folder proposal

```text
ecomos-ui/components/
├── ui/                 # shadcn/Radix primitives
├── shell/
├── navigation/
├── page/
├── metrics/
├── charts/
├── data-table/
├── records/
├── trace/
├── feedback/
├── forms/
└── domain/             # only genuinely domain-specific composites
```

## Component acceptance criteria

- no copied page-specific 900-line component;
- semantic status/token mapping is centralized;
- tables, charts, drawers, and page headers have shared contracts;
- every reusable component has representative states in a component gallery or internal `/design-system` route;
- components work in both themes;
- keyboard/focus behavior is verified;
- mobile rendering is deliberate;
- fixture data enters via typed props, not imports hidden inside generic components;
- business labels live in page/domain composition, not generic primitives.