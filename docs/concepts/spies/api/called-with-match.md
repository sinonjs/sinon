---
title: spy.calledWithMatchMatch
description: Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called with matching arguments (and possibly others).
---

# `spy.calledWithMatch`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called with matching arguments (and possibly others).

This behaves the same as `spy.calledWith(sinon.match(arg1), sinon.match(arg2), ...)`.

<<< ../../../.vitepress/tests/docs/spies/api/called-with-match.test.js

## Resetting `calledWithMatch` to default

You can reset `calledWithMatch` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
