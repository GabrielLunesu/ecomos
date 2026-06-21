# EcomOS production documentation

## Mission

Turn the approved `ecomos-ui/` prototype into a production, self-hosted operating system for one ecommerce store, with OpenClaw as a hidden internal runtime.

The target user operates roughly €10k–€500k in monthly store revenue and wants one place to understand and operate customer service, finance, marketing, commerce, operations, tasks, agents, knowledge, activity, settings, and chat—including autonomous workflows that remain inspectable.

## Current truth

`ecomos-ui/docs/AS-BUILT.md` is the definitive statement of the current product and UI. In particular:

- one store per deployment;
- route-driven shell and navigation;
- no redundant Overview submenu rows;
- page identity in the command bar;
- one global analysis period;
- full-page Ask EcomOS;
- the current built/scaffolded route inventory;
- deterministic scenario fixtures that become the initial product contract.

These production documents add the backend/runtime/connector contract. They do not redesign the approved UI.

## Reading order

1. `00-PRODUCT-VISION.md`
2. `01-SYSTEM-ARCHITECTURE.md`
3. `02-TECHNICAL-DECISIONS.md`
4. `03-ENGINEERING-STANDARDS.md`
5. `04-IDENTITY-AND-RBAC.md`
6. `05-DATA-AND-TRACEABILITY.md`
7. `06-OPENCLAW-RUNTIME.md`
8. `07-WORKFLOWS-ACTIONS-APPROVALS.md`
9. `08-CONNECTORS.md`
10. `09-SECURITY-AND-SECRETS.md`
11. `10-TESTING-AND-E2E.md`
12. `11-OPERATIONS-AND-RECOVERY.md`
13. `12-DOMAIN-MODULES.md`
14. `LOCAL-INTEGRATION-RUNBOOK.md`
15. `TEST-ACCOUNT-RUNBOOK.md`
16. `ECOMOS-BUILD-SPEC.md`
17. root `AGENTS.md`

## Source-of-truth hierarchy

1. `ecomos-ui/docs/AS-BUILT.md`
2. root `AGENTS.md`
3. ADRs in `02-TECHNICAL-DECISIONS.md`
4. architecture and build specification
5. focused specs and runbooks
6. living documents
7. read-only references

## Build posture

This is not an MVP plan. The system is built in gated vertical slices with production data integrity, authorization, traceability, recovery, and real sandbox-account E2E tests from the beginning.

The first technical gate is not a feature page. It is a real local OpenClaw runtime and real test-account connectivity for Shopify, Google Ads, and Outlook.
