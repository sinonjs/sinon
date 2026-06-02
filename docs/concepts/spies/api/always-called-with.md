---
title: spy.alwaysCalledWith
description: Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was always called with the provided arguments.
---

# `spy.alwaysCalledWith`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was always called with the provided arguments.

Can be used for partial matching, Sinon only checks the provided arguments against actual arguments, so a call that received the provided arguments (in the same spots) and possibly others as well will return true.

<<< ../../../.vitepress/tests/docs/spies/api/always-called-with.test.js

## Resetting `alwaysCalledWith` to default

You can reset `alwaysCalledWith` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
