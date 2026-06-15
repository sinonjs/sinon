---
title: spy.returnValues
description: Array of return values, `spy.returnValues[0]` is the return value of the first [call](/concepts/spy-call/) of the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).
---

# `spy.returnValues`

Array of return values, `spy.returnValues[0]` is the return value of the first [call](/concepts/spy-call/) of the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).

If the call did not explicitly return a value, the value at the call's location in `.returnValues` will be `undefined`.

<<< ../../../.vitepress/tests/docs/spies/api/return-values.test.js

## Resetting `returnValues` to default

You can reset `returnValues` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
