---
title: spy.calledImmediatelyAfter
description: Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called after another, and no [`calls`](/concepts/spy-call/) occurred between them.
---

# `spy.calledImmediatelyAfter`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called after another, and no [`calls`](/concepts/spy-call/) occurred between them.

<<< ../../../.vitepress/tests/docs/spies/api/called-immediately-after.test.js

## Resetting `calledImmediatelyAfter` to default

You can reset `calledImmediatelyAfter` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
