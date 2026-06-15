---
title: spy.alwaysCalledWithMatch
description: Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was always called with matching arguments (and possibly others).
---

# `spy.alwaysCalledWithMatch`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was always called with matching arguments (and possibly others).

This behaves the same as `spy.alwaysCalledWith(sinon.match(arg1), sinon.match(arg2), ...)`.

<<< ../../../.vitepress/tests/docs/spies/api/always-called-with-match.test.js

## Resetting `alwaysCalledWithMatch` to default

You can reset `alwaysCalledWithMatch` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
