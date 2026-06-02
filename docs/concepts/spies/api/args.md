---
title: spy.args
description: Array of arguments received, `spy.args[0]` is an array of arguments received in the first [call](/concepts/spy-call/) of the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).
---

# `spy.args`

Array of arguments received, `spy.args[0]` is an array of arguments received in the first [call](/concepts/spy-call/) of the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).

<<< ../../../.vitepress/tests/docs/spies/api/args.test.js

## Resetting `args` to default

You can reset `args` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
