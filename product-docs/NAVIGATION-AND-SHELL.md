# Navigation and application shell

## Shell composition

```text
┌─────────────────┬──────────────────────────────────────────────┐
│ Brand identity  │ Global header                                │
│                 ├──────────────────────────────────────────────┤
│ Core shortcuts  │ Page heading + contextual actions            │
│                 ├──────────────────────────────────────────────┤
│ Departments     │                                              │
│  ↳ subpages     │ Page workspace                               │
│                 │                                              │
│ Intelligence    │                                              │
│                 │                                              │
│ System          │                                              │
└─────────────────┴──────────────────────────────────────────────┘
                                             ┌───────────────────┐
                                             │ Ask Ecom-OS panel │
                                             └───────────────────┘
```

The desktop application uses an inset canvas similar to the visual reference: a stable sidebar and a bordered content frame. The content frame owns scrolling; the sidebar and global header remain stable.

## Desktop dimensions

Initial design targets, subject to visual tuning:

- expanded sidebar: 256px;
- collapsed sidebar: 48px;
- global header: 52px;
- page horizontal padding: 24px at wide desktop, 16px at compact desktop;
- content max width: fluid for operational tables, optionally constrained for forms/documents;
- outer inset: 8px on large screens;
- primary panel gap: 16–24px;
- minimum common interactive height: 32px desktop, 40px touch-focused surfaces.

Do not force a single max-width container on analytics tables and timelines.

## Sidebar anatomy

### Header

Brand mark and name, followed by a store/context chevron. The dropdown provides:

- All stores;
- named stores;
- connection-health summary;
- manage stores;
- brand settings.

This is not an organization switcher.

### Core shortcuts

Always visible above department groups:

- Search;
- Command Center;
- Inbox, with unread/attention count;
- My Tasks, with due count.

Search may open the command palette instead of navigating.

### Department groups

Sections are visually labelled **Departments**, **Intelligence**, and **System**. Department items support children. Children are indented, use smaller icons only when meaningfully distinct, and display the active item through a calm neutral highlight plus a small active indicator.

### Footer

Use a compact operator/profile control and system-health indicator. Do not include promotional template content.

Suggested footer states:

- all systems healthy;
- one connection degraded;
- action queue paused;
- offline/demo scenario.

## Expansion rules

A navigation node has separate label and disclosure behavior:

- label click: navigate to department root and expand;
- chevron click: only expand/collapse;
- active descendant: parent remains visually active and open;
- collapsed sidebar: department icon opens the root route; tooltip lists the department name;
- context menu: optional “Open overview” and child shortcuts, not required for v1 prototype.

Expanded state is locally persisted for review, but active-route expansion always wins.

## Active states

- exact route: strongest active child state;
- parent of exact route: active department state;
- manually expanded but inactive: disclosure state only, no active color;
- item with attention: count/dot separate from active state;
- unavailable module: visible disabled state with reason tooltip where product review needs to evaluate discoverability.

## Global header

### Left

- sidebar trigger;
- route icon at desktop widths;
- breadcrumb/title;
- current context badge where relevant.

Breadcrumb examples:

```text
Finance / Orders & Margin
Customer Service / Tickets / TKT-1042
Agents / Runs / RUN-882
```

### Right

- human and active-agent presence stack;
- Ask Ecom-OS;
- notifications;
- context/date controls only when globally pinned;
- theme switcher;
- profile/role-preview menu.

The header should remain compact. Move page-specific actions below it.

## Page heading

Every page starts with a standard heading contract:

- eyebrow or breadcrumb only when useful;
- title;
- one-line purpose/status description;
- freshness/context metadata;
- primary action;
- secondary actions/overflow;
- optional tabs or saved-view selector.

Example:

```text
Finance
Understand contribution margin and the inputs behind it.
All stores · Last 30 days · Updated 8 minutes ago
                                       [Export] [Ask about this]
```

## Ask Ecom-OS panel

The right-side panel is 400–480px on desktop and full-screen on mobile. It contains:

- current-context header;
- session selector;
- messages;
- cited entities/sources;
- suggested follow-ups;
- composer;
- open-full-chat action.

Opening it should not destroy page state. Page content may compress above a wide breakpoint and overlay below it. Product review chooses the final behavior after comparison.

## Notifications

The notification popover groups:

- approvals;
- customer-service exceptions;
- financial/data alerts;
- agent/system failures;
- mentions and assignments.

Each item links to a route or drawer. The notification center is not a substitute for Inbox; it is a compact recent-attention surface.

## Command palette

Groups:

1. Navigate
2. Search records
3. Recent
4. Create/assign
5. View switches
6. Help and settings

Keyboard behavior:

- `Cmd/Ctrl+K`: open;
- `/`: open search when focus is not in an input;
- arrows: navigate;
- Enter: activate;
- Escape: close and restore focus.

## Drawers and sheets

Standard widths:

- narrow inspector: 360–420px;
- record detail: 520–640px;
- trace detail: 640–760px;
- mobile: full viewport.

Drawers preserve background filters/scroll. A drawer header includes entity type, identifier, status, previous/next controls when appropriate, open-full-page, and close.

## Responsive breakpoints

### Wide desktop

Expanded sidebar, multi-column page layouts, optional compressed content when Ask Ecom-OS opens.

### Compact desktop/tablet landscape

Collapsible sidebar; secondary side panels stack below primary content; dense tables remain available with horizontal containment.

### Tablet portrait

Sidebar uses Sheet; page actions may wrap; inspector drawers occupy most width; tables switch to priority columns.

### Mobile

- mobile Sheet navigation;
- single-column content;
- page actions collapse to primary plus overflow;
- KPI summaries become horizontally scrollable only if comparison is essential, otherwise stack;
- tables become record lists or limited-column tables with detail sheets;
- Ask Ecom-OS becomes full-screen;
- charts reduce tick density and series count.

## Scroll behavior

- application frame fills the viewport;
- sidebar scrolls independently if navigation exceeds height;
- header remains sticky inside the content frame;
- page workspace owns vertical scrolling;
- table headers may remain sticky inside long data regions;
- opening overlays locks only the appropriate underlying scroll container.

## Navigation configuration contract

The future implementation should expose a typed configuration similar to:

```ts
type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  section: "core" | "departments" | "intelligence" | "system";
  children?: NavItem[];
  badge?: "inbox" | "tasks" | "alerts";
  optionalFeature?: "inventory";
};
```

The configuration must be domain-agnostic enough to power route labels but not overloaded with business-state logic.

## Shell acceptance criteria

- all routes can be reached by mouse, keyboard, and mobile navigation;
- submenu active state derives from the pathname;
- brand/store context is visually distinct from tenant switching;
- sidebar state persists locally without overriding active route visibility;
- global header does not change height between pages;
- page headings use one contract;
- Ask Ecom-OS opens without losing page filters or selection;
- focus is restored correctly after closing navigation, palette, dialogs, and drawers;
- light/dark theme switch does not flash the wrong theme;
- navigation remains usable at 320px width and at 200% browser zoom.