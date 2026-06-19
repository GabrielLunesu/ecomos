# Dashboard inspiration source audit

## Purpose

`dashboard-inspo/` is a visual and interaction reference. It is not the Ecom-OS product architecture, domain model, or final component implementation.

## Observed stack

The reference application currently uses:

- Next.js 16 and React 19;
- TypeScript;
- Tailwind CSS 4;
- Radix primitives through shadcn-style components;
- the shadcn `new-york` style with a neutral base;
- CSS-variable theme tokens in OKLCH;
- `next-themes` for light/dark/system themes;
- Lucide icons;
- Recharts;
- TanStack Table;
- Zustand;
- Vaul;
- a responsive shadcn sidebar implementation.

This is an appropriate basis for the UI-only prototype.

## Design language extracted

The useful language is structural rather than ornamental:

- a stable, collapsible left navigation rail;
- a thin global header;
- a bordered application canvas inset from the desktop viewport;
- neutral layered surfaces with subtle one-pixel borders;
- compact typography and controls;
- dense operational tables;
- contextual controls located beside the content they affect;
- responsive collapse to a mobile Sheet;
- color reserved mainly for status, trend, category, and chart identity;
- clear separation between global navigation, page context, page actions, and content.

## Adopt

Adopt the following ideas and, where suitable, underlying primitives:

- responsive `SidebarProvider` behavior;
- icon-collapsible desktop sidebar;
- mobile Sheet navigation;
- remembered sidebar state;
- keyboard sidebar toggle;
- global header proportions;
- theme provider and semantic CSS variables;
- OKLCH color-token approach;
- neutral card, popover, input, and border language;
- Radix dropdown, dialog, popover, tooltip, select, checkbox, collapsible, and avatar primitives;
- compact search/filter/sort controls;
- data-table density, row selection, pagination, and sortable headers;
- chart panel framing and local chart controls;
- restrained radius scale.

## Adapt

Adapt these patterns for the Ecom-OS domain:

| Reference pattern | Ecom-OS adaptation |
|---|---|
| Workspace switcher | Brand identity plus store/context selector |
| Ask AI | Persistent **Ask Ecom-OS** side panel and full chat page |
| Team avatars | Human operators plus active agents |
| Workgroups tree | Route-driven departments and subpages |
| Dashboard | Command Center focused on decisions and exceptions |
| Leads table | Reusable domain data-table framework |
| Leads chart | Semantic ecommerce series: contribution margin, revenue, spend, COGS, orders |
| Top performers | Contextual ranked panel: campaigns, products, stores, agents, or issues |
| Add project / new client | Page-specific primary actions |
| Share | Export/share only where the content supports it |

## Reject

Do not carry these implementation choices into the new application:

- hard-coded `isActive` navigation flags;
- `href="#"` route placeholders;
- local sidebar expansion state that ignores the URL;
- template-specific labels and calls to action;
- the marketing card in the sidebar footer;
- the GitHub-template button in the production header;
- generic chart fields such as `line1`, `line2`, and `line3`;
- decorative color with no semantic meaning;
- one giant page-specific table component;
- repeating an identical KPI/chart/table formula on every page;
- remote avatar dependencies as required production assets;
- a desktop layout that merely overflows on smaller screens;
- pages whose main purpose is visual fullness rather than operator decisions.

## Known source limitations

The reference currently behaves as one hard-coded dashboard route. Its navigation is not connected to routes, its active item is fixed, and most actions are local demonstration interactions. Seed data is lead-management-specific and stored in a large fixture module. These limitations are expected in a template but must not become architectural constraints.

## Licensing gate

The source links to the Square/lndev-ui project and describes itself as open-source. Before copying source files into `ecomos-ui/`, verify the exact repository license and any attribution conditions. Record the license and copied/adapted files in the new application. Until that check is complete, treat the source as a reference and avoid removing attribution from copied code.

## Frozen-reference rule

During the UI-first build:

- do not add Ecom-OS routes to `dashboard-inspo/`;
- do not import business-domain components from it at runtime;
- do not edit it to make progress appear complete;
- compare against it visually, then implement the Ecom-OS system in `ecomos-ui/`;
- document any direct code adoption and its license provenance.