---
title: spy.calledImmediatelyBefore
description: Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called before another, and no [`calls`](/concepts/spy-call/) occurred between them.
---

# `spy.calledImmediatelyBefore`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called before another, and no [`calls`](/concepts/spy-call/) occurred between them.

<<< ../../../.vitepress/tests/docs/spies/api/called-immediately-before.test.js

## Resetting `calledImmediatelyBefore` to default

You can reset `calledImmediatelyBefore` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
