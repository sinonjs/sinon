---
title: spy.restore
description: Replaces the [`spy`](../) or [`stub`](/concepts/stubs/) with the original method. Only available if the [`spy`](../) or [`stub`](/concepts/stubs/) replaced an existing method.
---

# `spy.restore`

Replaces the [`spy`](../) or [`stub`](/concepts/stubs/) with the original method. Only available if the [`spy`](../) or [`stub`](/concepts/stubs/) replaced an existing method.

<<< ../../../.vitepress/tests/docs/spies/api/restore.test.js

## Other ways of restoring

You can also reset the whole sandbox, by using [`sinon.restore`](/concepts/sandboxes/api/restore) or [`sinon.reset`](/concepts/sandboxes/api/reset).
