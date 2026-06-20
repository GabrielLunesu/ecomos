# Ecom-OS UI-first product specification

## Status

**Planning baseline for the new UI-only prototype.**

The repository contains a frozen visual reference in `dashboard-inspo/`. That application is not the new Ecom-OS frontend and must not be incrementally converted into one. We first define and build the complete product surface with deterministic seed data; backend, Hermes, connector, authentication, database, and commerce execution work starts only after the prototype is reviewed and accepted.

## Objective

Design a coherent ecommerce operating system in which a small brand team can:

- understand the state of the business quickly;
- navigate departments and their subpages without losing context;
- inspect every important metric, ticket, action, agent run, and anomaly;
- ask Ecom-OS questions from any page;
- see loading, empty, stale, degraded, unauthorized, and failure states before real integrations exist;
- approve the information architecture and interaction language before application logic constrains the interface.

## Hard boundaries for this phase

The prototype contains:

- Next.js routes and layouts;
- Radix/shadcn components;
- responsive navigation;
- light and dark themes;
- deterministic TypeScript fixtures;
- local UI state for navigation, tables, filters, drawers, dialogs, simulated workflows, and scenario switching;
- complete page and component states.

The prototype does **not** contain:

- backend imports or API requests;
- a database or migrations;
- real authentication;
- Hermes transports or model calls;
- Composio, Shopify, inbox, advertising, or payment connections;
- real money-touching actions;
- copied legacy frontend logic.

## Source-of-truth order

1. `INFORMATION-ARCHITECTURE.md`
2. `PAGE-BLUEPRINTS.md`
3. `NAVIGATION-AND-SHELL.md`
4. `COMPONENT-SYSTEM.md`
5. `INTERACTION-STATES.md`
6. `SEED-DATA-CONTRACT.md`
7. `DESIGN-PRINCIPLES.md`
8. `SOURCE-AUDIT.md`
9. `PROTOTYPE-BUILD-PLAN.md`

When implementation and these documents disagree, update the document deliberately or fix the implementation. Do not allow silent drift.

## Decision gates

The UI prototype is ready for backend integration only when:

1. every route in the approved map is navigable;
2. department submenus are route-driven and work on desktop and mobile;
3. all visible controls have a useful interaction or an explicitly disabled state;
4. primary pages use realistic, cross-linked seed data;
5. loading, empty, stale, partial, error, and permission states can be previewed;
6. dark and light themes have parity;
7. desktop, tablet, and mobile layouts have been reviewed;
8. the operator can complete the core journeys documented in the page blueprints;
9. no page exists merely to display decorative KPIs;
10. product review explicitly approves the shell, navigation, page hierarchy, and component language.

## Repository shape

```text
/
├── dashboard-inspo/       # Frozen Square/lndev-ui reference
├── ecomos-ui/             # New UI-only prototype, created in the build phase
└── product-docs/          # This product and UX specification
```

Do not delete `dashboard-inspo/` until the new design system has been implemented, compared, and documented.