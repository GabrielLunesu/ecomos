# 07 — Workflows, actions, and approvals

## Workflow ownership

EcomOS owns business workflow state. OpenClaw may reason, propose, coordinate, and execute granted tools, but it does not become the source of truth for ticket, order, campaign, task, approval, or action states.

## Workflow definition

A workflow version contains:

- trigger types;
- eligibility conditions;
- steps and transitions;
- agent/runtime profile;
- permitted tools;
- approval policy;
- caps and limits;
- timeout/retry policy;
- escalation behavior;
- test scenarios;
- effective version.

Running instances retain their original version unless explicitly migrated.

## Trigger types

- verified provider event;
- schedule;
- human command;
- agent proposal;
- state transition;
- monitoring rule/anomaly.

Triggers create one durable workflow run with a deduplication key.

## Action command contract

Every external action has:

```text
actionType
targetType + targetId
parameters
actor
workflow/run/session context
evidence references
requested autonomy/approval mode
idempotency key
expected preconditions
```

Examples:

- send customer reply;
- create discount;
- request/refund order;
- change campaign status/budget;
- update fulfilment data;
- deliver daily brief.

## Fresh-state preconditions

Before execution, the worker reloads relevant provider/business state and checks expected versions. A proposal based on stale state is rejected or returned for regeneration/approval.

## Autonomy modes

### Observe

Read, analyze, draft, and create tasks; no external write.

### Propose

Create exact action proposals for human approval.

### Bounded autonomous

Execute configured actions within explicit caps/conditions.

### Unrestricted owner grant

Execute granted action types without human approval. This remains subject to identity, schema, policy existence, fresh-state, idempotency, trace, and reconciliation.

## Approval policy

Policies can consider:

- action type;
- amount/discount/budget;
- customer/order risk;
- actor/agent;
- workflow;
- time/day;
- confidence/data completeness;
- separation of duties;
- owner autonomy grant.

Approval is an EcomOS decision, not merely an OpenClaw execution prompt.

## Exact approval binding

Compute a canonical digest over:

- action type;
- target;
- normalized parameters;
- store/account;
- policy/workflow version;
- expiry;
- material evidence version.

Any material change creates a new action/proposal and invalidates the old approval.

## Execution attempts

Each attempt stores:

- attempt number;
- started/finished time;
- connector/runtime version;
- request fingerprint;
- safe request summary;
- HTTP/RPC status;
- provider request/receipt ID;
- normalized result/error;
- retryability;
- trace span.

## Outcome uncertainty

Timeout, connection reset, or ambiguous response after sending a request becomes `outcome_uncertain`, not `failed`.

The action is not retried until a connector-specific reconciliation query determines whether the effect occurred.

## Idempotency

- Stable idempotency key generated before enqueue.
- Unique database constraint.
- Provider-native idempotency used where available.
- If unavailable, store business fingerprint and reconcile before retry.
- Message sends, discounts, refunds, budgets, and fulfilment mutations have connector-specific duplicate protection.

## Compensation

Where safe, workflows can define compensating actions. Compensation is a new traceable action, never an invisible rollback.

## Kill switches

- Global autonomy pause.
- Per-domain pause.
- Per-workflow disable.
- Per-agent disable.
- Per-connector write disable.
- Queue drain/maintenance mode.

Read-only sync and UI access may continue while writes are paused.

## Required tests

- duplicate trigger creates one workflow;
- concurrent commands create one action;
- stale proposal denied;
- approval digest mismatch denied;
- expired approval denied;
- unrestricted mode skips only human approval;
- timeout becomes uncertain;
- reconciliation prevents duplicate retry;
- kill switch blocks provider writes;
- action history remains complete after retries/restarts.
