---
title: spy.withArgs
description: Creates a [`spy`](../) or [`stub`](/concepts/stubs/) that only records [calls](/concepts/spy-call/) when the received arguments match those passed to `withArgs`. This is useful to be more expressive in your ...
---

# `spy.withArgs`

Creates a [`spy`](../) or [`stub`](/concepts/stubs/) that only records [calls](/concepts/spy-call/) when the received arguments match those passed to `withArgs`. This is useful to be more expressive in your assertions, where you can access the spy with the same [call](/concepts/spy-call/).

Uses deep comparison for objects and arrays. Use `spy.withArgs(sinon.match.same(obj))` for strict comparison (see [matchers](/concepts/matchers/)).

<<< ../../../.vitepress/tests/docs/spies/api/with-args.test.js
