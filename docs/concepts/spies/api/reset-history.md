---
title: spy.resetHistory
description: Resets the state of a [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).
---

# `spy.resetHistory`

Resets the state of a [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).

<<< ../../../.vitepress/tests/docs/spies/api/reset-history.test.js

In the example above, we can see that `callCount` is reset. Resetting history resets **all** recording properties of a [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/), there are too many to list here.

## Other ways of resetting history

You can also reset the history for the whole sandbox, by using [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history) or [`sinon.reset`](/concepts/sandboxes/api/reset).
