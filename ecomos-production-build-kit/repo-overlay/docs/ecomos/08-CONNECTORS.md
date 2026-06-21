# 08 — Connector architecture

## Principle

Connectors are deterministic provider adapters owned by EcomOS. Agents receive business tools backed by these adapters; they do not receive raw provider SDKs or credentials.

## Connector contract

Every connector supports applicable operations:

- connect/authorize;
- revoke;
- health/capability discovery;
- incremental/full sync;
- webhook/subscription setup;
- read/query;
- action execution;
- reconciliation;
- rate-limit/backoff metadata;
- secret rotation;
- test-fixture/fake adapter.

Provider payloads are parsed into versioned normalized contracts at the adapter boundary.

## Secret and account model

A connector account contains:

- type;
- provider account/store/mailbox ID;
- display metadata;
- environment classification (`test`, `shadow`, `production`);
- capabilities;
- encrypted secret references;
- token expiry/rotation state;
- health;
- sync cursors;
- last success/error.

No token is returned by read APIs.

## Shopify

### Environment

Use a Shopify development store. It cannot process real transactions and supports test orders through Shopify testing mechanisms.

### Initial scope

- store metadata;
- products/variants;
- customers required for operations/CS;
- orders and line items;
- fulfilments/tracking;
- refunds/returns where supported;
- discounts;
- webhooks;
- financial/transaction data available to the app.

Request the minimum scopes necessary and document each scope-to-feature mapping.

### Sync

- GraphQL Admin API with a pinned version.
- Webhooks for low-latency changes.
- Incremental reconciliation jobs to recover missed events.
- Provider IDs and update timestamps retained.
- HMAC verified before persistence.

### Write tests

Only against the dev store. Create test order data, fulfilments, discounts, and refund simulations supported by the test environment. Every write is verified through a follow-up read.

## Microsoft Outlook / Graph

### Environment

Use a Microsoft 365 developer sandbox or dedicated test tenant/mailbox.

### Initial delegated scopes

Target minimum practical delegated permissions, expected to include:

- `offline_access`;
- identity basics;
- `Mail.ReadWrite` for message/folder state;
- `Mail.Send` for replies;
- shared mailbox permissions only if the selected test scenario requires them.

Production application permissions are not enabled by default. If later required, restrict mailbox access through Microsoft controls.

### Ingestion

- Microsoft Graph subscriptions/webhooks where stable;
- delta queries as recovery/source of truth;
- immutable provider message/thread IDs;
- HTML/body sanitization;
- attachments scanned/limited before storage/use;
- mailbox folder/category semantics normalized.

### Send/reply

Store exact outbound proposal, Graph request ID/result, conversation references, and follow-up verification. Duplicate-send protection is mandatory.

## Google Ads

### Environment

Use a separate Google Ads test-manager hierarchy and test client account. It has no billing and cannot serve ads or interact with production accounts.

### Initial scope

- account hierarchy and metadata;
- campaigns, budgets, ad groups, ads/assets where required;
- GAQL reporting/query layer;
- controlled create/update/pause operations in the test account;
- change history where available.

### Test limitation

Test accounts have no serving metrics such as impressions, conversions, and costs. Therefore:

- API auth, query, mutation, lifecycle, errors, and reconciliation use the real test account;
- analytics screens use deterministic/recorded datasets until a read-only production shadow is explicitly authorized;
- tests never invent that test-account metrics are real.

## Connector execution rules

- Parse provider errors into stable categories.
- Respect retry headers and quotas.
- Retry only idempotent or reconciled operations.
- Circuit-break degraded connectors.
- Keep last-good projections visible with freshness state.
- Record raw provider request IDs, not secrets/full bodies.

## Connection-first development gate

Before building full domain features, prove real sandbox connectivity:

1. Shopify health and bounded read/write round trip.
2. Outlook health, read, send-to-test-mailbox, and reply round trip.
3. Google Ads account discovery, query, create/update/pause round trip.
4. Token refresh/restart persistence.
5. Disconnect/reconnect and invalid-token error handling.

Credential or OAuth consent steps are explicit human gates. Codex stops and requests exactly what is needed.
