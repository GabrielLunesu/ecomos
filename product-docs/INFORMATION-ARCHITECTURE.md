# Ecom-OS information architecture

## Product frame

Ecom-OS is one operating system for one ecommerce brand. A brand may contain multiple stores, channels, inboxes, ad accounts, and team members, but the application is not a multi-tenant SaaS workspace switcher.

The shell has four layers:

1. **Global context** — brand, store scope, date range, search, Ask Ecom-OS, notifications, profile.
2. **Primary navigation** — core work and departments.
3. **Department subnavigation** — route-driven subpages revealed when a department is active or expanded.
4. **Page workspace** — page heading, page-specific controls, content, drawers, dialogs, and detail routes.

## Primary navigation

```text
Core
├── Command Center
├── Inbox
└── My Tasks

Departments
├── Customer Service
├── Finance
├── Marketing
├── Commerce
└── Operations

Intelligence
├── Agents
├── Knowledge
└── Activity & Traces

System
└── Settings
```

Search is a global command surface rather than a normal department route. Ask Ecom-OS is available globally as a right-side panel and as a full-page route.

## Route map

```text
/
├── /command-center
│   ├── /command-center/daily-brief
│   ├── /command-center/insights
│   └── /command-center/alerts
│
├── /inbox
│   ├── /inbox/customer-tickets
│   ├── /inbox/approvals
│   ├── /inbox/mentions
│   └── /inbox/system-alerts
│
├── /tasks
│   ├── /tasks/my-work
│   ├── /tasks/team
│   └── /tasks/completed
│
├── /customer-service
│   ├── /customer-service/tickets
│   ├── /customer-service/automations
│   ├── /customer-service/prompts
│   ├── /customer-service/approvals
│   └── /customer-service/quality
│
├── /finance
│   ├── /finance/profit
│   ├── /finance/orders-margin
│   ├── /finance/spend-roas
│   ├── /finance/costs-fees
│   ├── /finance/payouts
│   └── /finance/reconciliation
│
├── /marketing
│   ├── /marketing/campaigns
│   ├── /marketing/creatives
│   ├── /marketing/content
│   ├── /marketing/audiences
│   └── /marketing/research
│
├── /commerce
│   ├── /commerce/orders
│   ├── /commerce/products
│   ├── /commerce/customers
│   └── /commerce/discounts
│
├── /operations
│   ├── /operations/fulfilment
│   ├── /operations/returns
│   ├── /operations/suppliers
│   ├── /operations/inventory
│   └── /operations/exceptions
│
├── /agents
│   ├── /agents/list
│   ├── /agents/runs
│   ├── /agents/tools-permissions
│   ├── /agents/memory
│   └── /agents/schedules
│
├── /knowledge
│   ├── /knowledge/brand-vault
│   ├── /knowledge/sops
│   ├── /knowledge/research
│   └── /knowledge/documents
│
├── /activity
│   ├── /activity/timeline
│   ├── /activity/agent-traces
│   ├── /activity/actions
│   └── /activity/errors
│
├── /settings
│   ├── /settings/stores
│   ├── /settings/integrations
│   ├── /settings/team
│   ├── /settings/notifications
│   ├── /settings/appearance
│   └── /settings/runtime
│
└── /chat
```

The department root route is always its **Overview** page. “Overview” appears as the first submenu item even though its URL is the department root.

## Department submenu behavior

### Desktop

- Clicking a department label navigates to its root overview route and expands its submenu.
- Clicking its chevron expands/collapses without navigation.
- The active department is automatically expanded.
- The active subpage is highlighted.
- One non-active department may remain manually expanded; do not force an accordion unless product review finds the sidebar too noisy.
- Collapsing the whole sidebar to icon mode hides subpage labels and exposes department names through tooltips.
- Returning to expanded mode restores the URL-driven department state.

### Mobile

- The sidebar appears in a Sheet.
- Departments expand within the Sheet.
- Selecting any route closes the Sheet and moves focus to the page heading.
- The active route remains visible on the next opening.

### Route ownership

Navigation state is derived from a typed route configuration and the current pathname. Do not hard-code `isActive` values inside JSX. The same configuration powers:

- sidebar items;
- mobile navigation;
- breadcrumbs;
- command-palette route search;
- page titles and descriptions;
- permissions/feature visibility in later phases.

## Global header

Left region:

- sidebar trigger;
- breadcrumb or current route title;
- optional store/context badge when a page is scoped.

Right region:

- human/agent presence cluster;
- **Ask Ecom-OS** button;
- notifications;
- store/context selector;
- theme switcher;
- profile menu.

Page-specific primary actions do not belong permanently in the global header. They live in the page heading region unless the action is globally meaningful.

## Brand and store context

The top-left identity control represents the brand. Its menu contains:

- brand profile;
- all-stores summary;
- named store contexts;
- connection health summary;
- settings link.

Changing store context updates the visible context badge and seeded page values but does not simulate multi-tenancy. The context choices are:

- **All stores**;
- one named store;
- where applicable, one channel/account within the current store.

Pages that cannot support all-store aggregation must explain this and select a store explicitly.

## Date context

Date range is page-scoped unless the user explicitly pins a global analysis window. Every analytical panel shows its current period and comparison basis. Tables whose records are not naturally date-limited should not inherit a hidden global date filter.

## Ask Ecom-OS

Ask Ecom-OS has two forms:

### Persistent side panel

Available from every page. It receives simulated page context:

- current route;
- current store/date scope;
- selected records;
- active filters;
- visible anomalies.

Prototype responses are deterministic fixtures. The panel demonstrates citations, referenced entities, suggested follow-up questions, and links back into the UI.

### Full chat page

`/chat` supports longer conversations, session history, attachments as visual placeholders, referenced records, and a trace/details panel. No real model call is made in this phase.

## Global search and command palette

The command surface opens with `/` and `Cmd/Ctrl+K`. It searches seeded:

- pages and commands;
- orders;
- customers;
- tickets;
- products;
- campaigns;
- agents;
- documents;
- traces.

Results are grouped by type and support keyboard navigation. Destructive or money-touching commands are represented only as disabled demonstrations or confirmation flows in the UI-only phase.

## Details and drill-down hierarchy

Use three levels consistently:

1. **Page** for sustained work and broad datasets.
2. **Drawer/Sheet** for investigating one record without abandoning the page.
3. **Dialog** for one bounded decision or action.

Examples:

- click a ticket row → ticket detail drawer;
- click “View full conversation” → ticket detail page only if the workflow needs sustained work;
- click “Approve discount” → confirmation dialog;
- click an agent action → trace drawer;
- click “Open full trace” → activity trace route.

## Entity linking

Every seeded entity has a stable ID and visible relationships:

- ticket → customer, order, agent run, messages, approval, trace;
- order → customer, products, fulfilment, ticket, discounts, margin entries;
- campaign → ad account, creative, attributed orders, spend, agent insight;
- product → orders, campaign performance, returns, supplier, margin;
- action → actor, run, target entity, approval, result;
- metric → source systems, freshness, underlying records.

## Role and permission preview

The prototype includes a local role switcher for visual review only:

- Owner;
- Admin;
- Customer Service Lead;
- Customer Service Representative;
- Finance;
- Viewer.

Routes and controls should preview hidden, read-only, approval-only, and unauthorized states without implementing authentication.

## Feature visibility

Optional modules are hidden through local fixture configuration:

- Inventory is hidden by default for dropshipping-first brands.
- Supplier and fulfilment pages remain available.
- Marketing subpages can be marked disconnected if no ad account is present.
- Finance reconciliation remains visible even with partial data because missing data is itself operationally important.

## Core journeys

### Morning operator review

Command Center → Daily Brief → investigate margin decline → open affected campaigns/orders → assign task → ask Ecom-OS for explanation.

### Customer-service exception

Inbox → ticket requiring attention → inspect order and prior agent actions → view trace → approve or reject proposed resolution → observe timeline update.

### Financial investigation

Finance Overview → click contribution-margin change → Profit breakdown → Orders & Margin filtered to cause → inspect one order → source/freshness panel.

### Agent accountability

Agents Overview → failed runs → open run → inspect context, evidence, tools, and outcome → navigate to affected ticket/order → create follow-up task.

### Operations exception

Operations Exceptions → late fulfilment cohort → supplier/detail drawer → related customer tickets → assign remediation task.

## Naming rules

- Use **Command Center**, not Dashboard, for the primary overview.
- Use **Ask Ecom-OS**, not Ask AI.
- Use **contribution margin** or **estimated contribution margin** when accounting profit is not actually represented.
- Use **Customer Service**, not Support, for the department.
- Use **Activity & Traces** for inspectability; “Audit log” may be a filtered view later.
- Avoid generic labels such as Insights when a more specific name is available; the Command Center Insights page is reserved for cross-department findings.

## Open product decisions for prototype review

These are intentionally left to visual/user-flow review:

1. Whether My Tasks needs subpages in the sidebar or tabs inside one route.
2. Whether Marketing Research and Knowledge Research should remain separate lenses over shared records.
3. Whether Orders deserves a core shortcut in addition to Commerce navigation.
4. Whether the sidebar permits multiple manually expanded departments.
5. Whether Customer Service Prompts remains a standalone subpage or becomes part of Automation detail.
6. Whether agent Memory should be called Memory, Context, or Knowledge Access in the operator UI.