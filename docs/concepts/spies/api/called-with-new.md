---
title: spy.calledWithNew
description: Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called the `new` operator.
---

# `spy.calledWithNew`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called the `new` operator.

<<< ../../../.vitepress/tests/docs/spies/api/called-with-new.test.js

<!-- TODO: Commented out until we can make an example -->
<!--
Beware that this is inferred based on the value of the `this` object and the spy function's `prototype`, so it may give false positives if you actively return the right kind of object.
-->

## Resetting `calledWithNew` to default

You can reset `calledWithNew` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
