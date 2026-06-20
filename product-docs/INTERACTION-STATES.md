# Interaction and system states

## Purpose

The prototype must be reviewable as a product, not only as a collection of populated screenshots. Every important route and reusable component needs explicit state coverage.

## Global scenario switcher

During development, provide a non-production scenario control, preferably under a development menu or query parameter:

```text
?scenario=healthy
?scenario=attention
?scenario=incident
?scenario=empty
?scenario=partial
?scenario=stale
?scenario=offline
```

This makes states deterministic and shareable during review.

## Global application states

### Healthy

All core sources are connected and reasonably fresh. Attention still exists because a healthy business can have work, but there is no systemic failure.

### Attention required

Business is operating, but several items require decisions: approval, low-margin cohort, late fulfilments, or negative CS outcomes.

### Incident

One operational problem has meaningful cross-department impact. Example: supplier delay causes late orders, increased WISMO tickets, refunds, and margin decline.

### Empty/new brand

No real activity. The interface explains what will appear, how to connect data later, and what can be explored with demo data.

### Partial data

Some sources or fields are available, others are missing. Values are labelled estimated/partial rather than hidden or falsely precise.

### Stale

Last-good data remains visible with clear timestamp and warning. The page explains which parts may be outdated.

### Offline/degraded

One or more connectors/system services are unavailable. The UI separates data retrieval failure from action-execution unavailability.

## Page-state contract

Every core page supports at least:

1. Loading
2. Populated healthy
3. Populated with attention
4. First-use empty
5. No results after filters
6. Partial/stale data
7. Recoverable error
8. Unauthorized/read-only

Not every state requires a unique route; scenario and local component controls may switch them.

## Loading

- Use structural skeletons matching the final layout.
- Preserve page header and context where known.
- Show independent loading for panels that can resolve separately.
- Avoid a single spinner replacing the entire application shell.
- Tables show header and row skeletons.
- Drawers show record-shaped skeletons.
- Charts show framed plot skeletons with title/controls retained.

## Empty states

### First-use empty

Explain the value of the surface and the next setup step. In the UI-only prototype, setup actions open a simulation dialog.

### Zero activity

Celebrate or neutrally confirm that nothing requires attention. Do not use setup copy when the user simply has zero alerts/tickets.

### Filtered empty

Show active filters and one clear reset action. Preserve the table/page structure.

### Optional module hidden

Inventory is hidden by default. If directly routed, show a clear disabled-module state with an enable-preview action instead of a 404.

## Partial and estimated data

Rules:

- label the affected value;
- show missing inputs;
- show last-updated/source details;
- avoid misleading trend comparisons;
- preserve useful unaffected content;
- offer a drill-down to Reconciliation or Integrations.

Example:

```text
Estimated contribution margin
€18,420
Missing COGS for 42 orders · Ad data updated 3h ago
```

## Stale data

- keep last-good values visible;
- include timestamp and source;
- use a non-blocking banner at page or panel scope;
- visually distinguish stale from failed;
- do not animate stale charts as if live;
- actions depending on fresh state should appear disabled or require a simulated recheck.

## Error states

### Component error

One panel fails while the rest of the page remains usable. Show retry simulation and last-good data where the scenario provides it.

### Route error

The page can render its shell/header but not its primary dataset. Explain impact and alternative routes.

### Action error

Keep the dialog/drawer open, preserve user input, show the failed step, and allow retry/cancel. Simulate trace/timeline entry.

### Outcome uncertain

Special state for external actions where a timeout does not prove failure. Copy must avoid “failed, retry” if retry could duplicate an action. Show Rechecking/Reconciliation needed.

## Permissions and read-only states

Role preview should demonstrate:

- route hidden;
- route visible but read-only;
- action hidden;
- action disabled with reason;
- approval required;
- unrestricted/operator-owned mode.

Never present a disabled action without a discoverable explanation.

## Selection and bulk actions

- selection survives simple sorting/filtering only when IDs remain in the visible dataset and behavior is understandable;
- changing pages may clear selection unless explicitly supporting cross-page selection;
- bulk bar states exact count and action scope;
- risky bulk actions show review/confirmation;
- Escape clears selection only when focus/context makes that safe.

## Search and filters

- debounce only where necessary; local fixture filtering can be immediate;
- filter chips summarize active criteria;
- reset is always available;
- filter menus show selected counts;
- no-results state keeps filters visible;
- page refresh/revisit behavior is deliberately chosen and documented;
- command palette and page search are visually distinct.

## Drawers

States:

- loading record;
- populated;
- missing/deleted record;
- related data partial;
- action in progress;
- unsaved changes;
- previous/next record navigation;
- mobile full-screen.

Closing restores focus to the originating row/control. Browser back should close route-backed drawers in the future implementation; the prototype may simulate this with URL state.

## Dialogs and confirmations

For a consequential simulated action, review screen includes:

- actor;
- exact target;
- exact proposed change;
- reason/evidence;
- expected consequence;
- whether approval is required;
- cancel/confirm.

On confirm:

- disable duplicate submission;
- show progress;
- display success, failure, or uncertain outcome;
- mutate local fixture state where useful;
- append activity/trace event;
- provide navigation to resulting record.

## Ask Ecom-OS states

- closed;
- open with no session;
- populated session;
- generating simulation;
- cited answer;
- insufficient data answer;
- stale-source warning;
- error;
- full-page handoff;
- context changed while open.

The composer remains clear that responses are simulated in the prototype.

## Notifications and toasts

Use:

- toast for transient local success/failure;
- inline message for validation;
- panel/page banner for degradation;
- Inbox/notification item for persistent attention;
- dialog for deliberate confirmation.

Do not toast every automatic state change.

## Theme states

Review every core route in:

- dark;
- light;
- system preference;
- theme transition;
- first paint/no FOUC;
- high zoom;
- reduced motion.

Charts, badges, borders, skeletons, focus rings, and overlays require explicit theme checks.

## Responsive interaction states

### Desktop

- expanded sidebar;
- collapsed sidebar;
- Ask panel open;
- drawer open;
- long table and sticky header.

### Tablet

- sidebar Sheet;
- actions wrapping;
- table priority columns;
- wide drawer.

### Mobile

- navigation Sheet;
- full-screen record detail;
- full-screen Ask panel;
- chart legend/series controls condensed;
- table transformed to record list or constrained columns;
- primary action and overflow menu.

## Accessibility states

Review:

- keyboard-only journey;
- visible focus on all controls;
- focus trap and restoration for overlays;
- screen-reader labels for icon buttons;
- semantic live announcements for simulated action outcomes;
- error summary and field association;
- status text independent of color;
- 200% zoom;
- reduced motion;
- long translated-like strings to reveal brittle layout.

## State-review checklist per page

- [ ] Can the user identify current scope and freshness?
- [ ] Does loading preserve context?
- [ ] Are first-use and filtered-empty states distinct?
- [ ] Is partial data labelled rather than silently omitted?
- [ ] Does the page remain useful when one panel fails?
- [ ] Are actions represented correctly for read-only/approval roles?
- [ ] Do drawers/dialogs restore focus?
- [ ] Does the mobile composition preserve the primary job?
- [ ] Can summaries be investigated?
- [ ] Are simulated writes clearly represented as simulated?
- [ ] Does light mode preserve hierarchy and contrast?
- [ ] Is no important meaning conveyed only by color or hover?