---
title: spy.neverCalledWithMatch
description: Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was never called with matching arguments.
---

# `spy.neverCalledWithMatch`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was never called with matching arguments.

This behaves the same as `spy.neverCalledWith(sinon.match(arg1), sinon.match(arg2), ...)`.

<<< ../../../.vitepress/tests/docs/spies/api/never-called-with-match.test.js

## Resetting `neverCalledWithMatch` to default

You can reset `neverCalledWithMatch` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
