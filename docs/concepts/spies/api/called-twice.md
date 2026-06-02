---
title: spy.calledTwice
description: "True when the fake, spy, or stub has been called exactly twice."
---

# `spy.calledTwice`

`true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) has been called exactly twice.

<<< ../../../.vitepress/tests/docs/spies/api/called-twice.test.js

## Resetting `calledTwice` to default

You can reset `calledTwice` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
