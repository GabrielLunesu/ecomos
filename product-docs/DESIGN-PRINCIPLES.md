# Ecom-OS design principles

## 1. An operating system, not a collection of dashboards

Every page must help an operator understand, decide, investigate, or act. A page is not complete because it contains four KPIs, a chart, and a table. Its composition must reflect the decisions made in that department.

## 2. Attention before information

The first screen answers:

1. What changed?
2. What needs attention?
3. What can wait?
4. What should I do next?

Normal performance belongs in context. Exceptions, uncertainty, stale data, blocked work, and unusual changes deserve stronger visual priority.

## 3. Dense, calm, and legible

Ecommerce operations produce large tables and many related entities. The interface should support density without feeling crowded:

- compact controls;
- consistent row heights;
- clear grouping and alignment;
- generous separation between major regions;
- few decorative borders;
- no oversized marketing typography inside the application;
- tabular numerals for financial and operational values.

## 4. Neutral foundation, semantic color

Surfaces remain neutral. Color communicates meaning:

- green: healthy, positive, completed, profitable;
- amber: attention, uncertainty, stale, warning;
- red: failed, blocked, loss, destructive;
- blue/cyan: informational, connected, in progress;
- violet: agent or intelligence context;
- pink/magenta: reserved accent, never the default status language.

Never rely on color alone. Pair it with text, iconography, position, or pattern.

## 5. Context is always visible

A user should always know:

- current department and subpage;
- selected brand/store scope;
- active date range;
- whether values are estimated or confirmed;
- data freshness;
- whether a panel is filtered;
- whether an action was performed by a person, an agent, or the system.

## 6. Every summary can be investigated

Metrics, alerts, chart points, badges, and agent outcomes must have a drill-down path. A number without provenance or a route to its underlying records is decoration.

The prototype should simulate these paths with drawers, dialogs, linked tables, or detail routes.

## 7. Agents are visible participants

Agents are not hidden magic. Show:

- which agent acted;
- what triggered it;
- what context and evidence it used;
- which tools it called;
- whether approval was required;
- the outcome and confidence/uncertainty;
- links to the complete trace.

Human and agent activity share a coherent timeline but remain visually distinguishable.

## 8. Traceability is part of the primary experience

Traceability is not relegated to an admin log. Tickets, orders, discounts, campaigns, approvals, and metrics expose their related activity and source evidence from their normal detail views.

## 9. Progressive disclosure over permanent complexity

The shell shows departments and active subpages. Detail appears through:

- expandable navigation;
- tabs within a detail view;
- side drawers for investigation;
- dialogs for bounded tasks;
- command/search surfaces for fast access;
- full pages for sustained work.

Do not permanently expose every setting and every relationship.

## 10. Real states, not happy-path screenshots

Every core component and route must represent:

- loading;
- first-use empty;
- no-results empty;
- healthy populated;
- partial data;
- stale data;
- degraded connector;
- recoverable error;
- blocked/unauthorized;
- destructive confirmation;
- long-content and high-volume variants.

## 11. Theme parity

Dark mode is the reference aesthetic, not the only supported experience. Light mode must preserve hierarchy, contrast, semantic color, chart readability, borders, overlays, and focus states.

## 12. Responsive by recomposition

Responsive design is not a smaller desktop:

- sidebar becomes a Sheet;
- wide tables use priority columns, row summaries, or horizontal containment;
- secondary panels move below primary work;
- detail drawers may become full-screen sheets;
- page actions collapse into an overflow menu;
- charts simplify labels rather than becoming unreadable;
- touch targets remain at least 40px where practical.

## 13. Accessibility is a component contract

Required:

- keyboard access for navigation, menus, tabs, drawers, tables, and command surfaces;
- visible focus styles;
- appropriate labels and descriptions;
- semantic headings;
- status meaning available to assistive technology;
- reduced-motion support;
- no critical hover-only information;
- adequate contrast in both themes;
- logical focus restoration when overlays close.

## 14. Motion confirms structure

Motion should explain changes rather than decorate them:

- sidebar expansion;
- drawer and dialog entry;
- list insertion/removal;
- chart-series changes;
- filter application;
- route-content appearance;
- success or failure confirmation.

Use one shared timing/easing system and honor `prefers-reduced-motion`.

## 15. Seed data should feel operationally true

Use linked, internally consistent entities rather than disconnected random values. A ticket should point to a real seeded customer and order. A refund should alter the seeded order margin. A campaign should drive attributed orders. An agent trace should link back to the action it produced.

## Visual baseline

- shadcn `new-york` component density;
- Radix primitives;
- neutral OKLCH tokens;
- Geist or a deliberately selected comparable sans;
- compact 12–14px metadata and controls;
- 14–16px normal content;
- 20–28px application page headings;
- restrained radii, generally 8–12px;
- one-pixel semantic borders;
- low-opacity shadows used mainly for overlays;
- tabular figures for currency, percentages, counts, and durations;
- consistent icon sizes and stroke weights through Lucide.

## Anti-patterns

Reject:

- glassmorphism as a default surface treatment;
- large gradients behind ordinary content;
- neon borders with no status meaning;
- excessive pills;
- repeated KPI cards simply to fill a grid;
- hidden data freshness;
- actions without feedback;
- nested modal chains;
- ambiguous icon-only controls;
- charts with unlabeled series;
- placeholder copy that survives into review;
- visually disabled controls that still appear actionable.