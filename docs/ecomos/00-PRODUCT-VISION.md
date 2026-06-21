# 00 — Product vision

## Thesis

EcomOS is a self-hosted operating system for a single ecommerce store. It combines the store's operating data, team workflows, knowledge, and autonomous agents in one product.

The operator should experience **EcomOS**, not a collection of developer tools. OpenClaw runs internally as the agent runtime, but users do not install, pair, upgrade, or debug OpenClaw separately.

## Primary user

A founder-led or small-team ecommerce brand doing approximately €10k–€500k per month. The common profile is dropshipping-first or light inventory, with:

- Shopify as commerce source;
- Outlook as support inbox;
- Google Ads as a marketing source;
- frequent WISMO and refund/return work;
- fragmented finance and operational visibility;
- a desire for strong automation without losing control or accountability.

## Product promise

EcomOS helps the operator:

- understand what changed and what requires attention;
- inspect contribution margin rather than revenue alone;
- run customer service and operational workflows;
- assign human and agent work;
- ask questions across the business;
- automate recurring and event-driven work;
- choose autonomy per workflow and capability;
- reconstruct why any important action happened.

## Product boundaries

### EcomOS owns

- the user experience;
- identity, team membership, roles, and permissions;
- business records and projections;
- connector configuration and sync state;
- tasks, tickets, workflows, approvals, and actions;
- evidence, audit, trace, and reconciliation;
- deployment, updates, backup, and health;
- the safe tool surface exposed to agents.

### OpenClaw owns

- model execution;
- agent sessions and runtime state;
- subagent execution;
- native schedules and messaging channels where selected;
- runtime-level memory and tool orchestration;
- streamed agent events.

EcomOS integrates with these capabilities but does not mirror OpenClaw's raw control interface into the product.

## Autonomy philosophy

The owner is allowed to grant broad autonomy, including permissions that can cause commercial mistakes. EcomOS must not infantilize the owner or pretend risk can be eliminated.

The product must instead make autonomy:

- explicit;
- scoped;
- revocable;
- observable;
- attributable;
- replayable at the decision/evidence level;
- safe against accidental duplicate execution.

“Unrestricted” means no mandatory human approval for that granted capability. It does not mean bypassing identity, validation, idempotency, traceability, or reconciliation.

## Success

A new instance can be installed and connected with guided authorization. The operator sees the approved EcomOS UI, not infrastructure. OpenClaw, databases, migrations, workers, tokens, and connector refreshes are managed by EcomOS.

A mature instance can:

- process thousands of support messages per month;
- reconcile orders, costs, ads, fees, and refunds;
- run scheduled briefs and monitoring;
- coordinate humans and agents;
- expose every consequential action in Activity & Traces;
- recover cleanly from process restarts and provider failures.

## Non-goals

- Multi-tenant SaaS in one deployment.
- Multiple stores inside one instance.
- Exposing raw OpenClaw setup/configuration to the merchant.
- A general-purpose developer agent platform.
- Premature network microservices.
- Using prompts as authorization.
- Declaring accounting profit when only contribution-margin inputs exist.
- Depending on a live merchant account for automated test runs.
