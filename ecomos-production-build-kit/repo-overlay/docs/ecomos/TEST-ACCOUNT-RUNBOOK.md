# Test-account runbook

## Safety rule

Automated development and CI use only dedicated test environments. A production merchant, mailbox, or advertising account requires explicit owner approval and a separate shadow/pilot phase.

## Shopify development store

Required:

- Shopify Partner/developer access;
- one dev store owned for testing;
- EcomOS app/custom app credentials appropriate to the selected auth design;
- products/customers/orders generated for tests;
- test payment/order mechanisms only.

Validation checklist:

- store visibly identified as a dev store;
- cannot process real transactions;
- callback/webhook URLs configured;
- minimum scopes reviewed;
- test order/product/customer created;
- credentials stored through EcomOS secret flow;
- read and bounded write verified;
- disconnect/reconnect tested.

## Google Ads test hierarchy

Required:

- separate Google account where practical;
- test manager account as hierarchy root;
- test client account;
- OAuth client;
- developer token from a manager account (test access is sufficient for test accounts);
- client customer ID and login customer ID.

Validation checklist:

- account UI shows Test/cancelled status;
- no billing;
- cannot interact with production hierarchy;
- create tagged campaign/budget/ad-group resources;
- query and mutate successfully;
- pause/cleanup resources;
- document that impressions/conversions/cost are empty.

Realistic marketing analytics use deterministic or sanitized recorded datasets until read-only production shadow is approved.

## Microsoft 365 / Outlook sandbox

Preferred:

- qualifying Microsoft 365 E5 developer sandbox with Outlook/sample data;
- otherwise dedicated test tenant/mailbox, never a personal/live support mailbox;
- Entra app registration and localhost/development redirect;
- delegated OAuth.

Initial permissions expected:

- `offline_access`;
- identity basics;
- `Mail.ReadWrite`;
- `Mail.Send`;
- shared-mail scopes only if needed.

Validation checklist:

- tenant/mailbox marked test;
- two or more test users/mailboxes for conversation round trips;
- receive/read/thread message;
- send/reply and verify Sent Items/thread IDs;
- subscription/webhook and delta recovery;
- token refresh after process restart;
- revoke/reconnect;
- no real customer recipient.

## Credential handoff to Codex

Never paste secrets into a committed prompt or Markdown file.

At each gate, provide credentials through the local secret input mechanism or temporary environment requested by Codex. Codex must:

- confirm `.gitignore` coverage;
- avoid echoing values;
- store encrypted/write-only through EcomOS when available;
- redact terminal/log output;
- update `living/INTEGRATION-STATE.md` with metadata only.

## Required connection evidence

For each provider record:

- environment classification;
- account/store/mailbox ID (safe metadata);
- granted scopes;
- connected/refresh timestamp;
- health result;
- test operations performed;
- provider request/resource IDs;
- cleanup/revocation result;
- no secret value.
