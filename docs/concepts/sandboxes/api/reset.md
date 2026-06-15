---
title: sandbox.reset
description: Resets the mutable behavior in [`stubs`](/concepts/stubs/) as well as the history of all [`fakes`](/concepts/fakes/), [`spies`](/concepts/spies/) and [`stubs`](/concepts/stubs/) created using the sandbox.
---

# `sandbox.reset();`

Resets the mutable behavior in [`stubs`](/concepts/stubs/) as well as the history of all [`fakes`](/concepts/fakes/), [`spies`](/concepts/spies/) and [`stubs`](/concepts/stubs/) created using the sandbox.

In terms of resetting history, this is equivalent to calling [`sandbox.resetHistory`](./reset-history).

## Example: resetting mutable behavior of stubs

<<< @/.vitepress/tests/docs/sandboxes/api/reset-1.test.js

## Example: `sinon.reset` does not change immutable behavior in fakes

<<< @/.vitepress/tests/docs/sandboxes/api/reset-2.test.js
