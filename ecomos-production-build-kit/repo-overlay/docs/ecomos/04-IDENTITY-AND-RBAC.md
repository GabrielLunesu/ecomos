# 04 — Identity and RBAC

## Model

One deployment begins with one **Owner** account. The Owner can create or invite additional accounts and assign role templates or custom permission sets.

OpenClaw's operator scopes do not represent EcomOS users. Only the backend holds the OpenClaw operator credential. Human access is enforced by EcomOS.

## First-run owner bootstrap

1. Installation generates a one-time owner setup token.
2. Setup is available only while no owner exists.
3. The token is short-lived, single-use, and never logged.
4. Owner creates credentials and optionally enables 2FA/passkey.
5. Setup endpoint becomes permanently unavailable unless explicitly reset from the host CLI.

## Authentication

Initial implementation uses a maintained TypeScript auth library (ADR target: Better Auth) with:

- email/password;
- database-backed sessions;
- secure, HTTP-only, same-site cookies;
- CSRF protection;
- password reset/invite tokens;
- session listing/revocation;
- login and recovery rate limits;
- optional TOTP and passkeys;
- no auth secrets in localStorage.

Deployment uses one browser origin so cookie boundaries remain simple.

## Permission registry

Permissions are stable strings, not route names. Initial groups include:

```text
system.manage
users.view
users.manage
roles.manage
integrations.view
integrations.manage
runtime.view
runtime.manage
settings.view
settings.manage

command_center.view
inbox.view
tasks.view
tasks.create
tasks.manage_all

cs.view
cs.view_assigned
cs.reply
cs.assign
cs.configure_automation
cs.review_quality

finance.view
finance.export
finance.reconcile

marketing.view
marketing.manage_campaigns
marketing.publish

commerce.view
customers.view
customers.view_pii
orders.view
orders.manage
products.manage
discounts.propose
discounts.execute

operations.view
operations.manage
returns.propose
returns.approve
refunds.propose
refunds.approve
refunds.execute

agents.view
agents.manage
agents.grant_tools
agents.change_autonomy
agents.view_memory

knowledge.view
knowledge.edit
activity.view
traces.view
approvals.view
approvals.decide
chat.use
```

## Role templates

- Owner — all permissions; ownership transfer and destructive system operations.
- Admin — almost all except ownership-only operations.
- Customer Service Lead — CS, approvals within grant, assigned task/team views.
- Customer Service Representative — assigned tickets/tasks, reply, limited customer/order context.
- Finance — finance, orders and payouts, no CS reply or agent grants.
- Marketing — marketing and relevant product analytics.
- Operations — fulfilment, suppliers, returns and relevant orders.
- Viewer — explicitly selected read permissions.

Templates are editable through role grants, but Owner invariants remain protected.

## Authorization decision

Every protected operation produces a structured decision:

```text
actor
permission requested
resource type/id
role/grants considered
object constraints
result allow/deny
reason code
policy version
trace id
```

Denied attempts are auditable without storing sensitive request bodies.

## Page visibility

The API returns the authenticated user's effective capability summary. The UI derives navigation and control visibility from it, but the backend rechecks every request.

A user may:

- not see a page;
- see a page read-only;
- see only assigned records;
- see values with PII masked;
- propose but not approve/execute an action.

## Separation of duties

Configurable policies can prevent one actor from both proposing and approving the same high-risk action. Owner can explicitly disable this for a single-store team, but the decision is recorded.

## Service identities

Separate machine identities exist for:

- OpenClaw MCP/runtime calls;
- background workers;
- webhook verification/processing;
- connector callbacks.

They receive only the commands required for their purpose and are not represented as human users.

## Tests

Required tests include:

- no-owner bootstrap races;
- invite expiry/replay;
- session revocation;
- role changes applied immediately;
- page and action permission matrix;
- assigned-ticket object scope;
- PII masking;
- proposal/approval separation;
- machine identity isolation;
- direct endpoint access despite hidden UI;
- OpenClaw tool call denied without capability.
