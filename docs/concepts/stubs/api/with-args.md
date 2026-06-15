---
title: stub.withArgs
description: Stubs the method only for the provided arguments.
---

# `stub.withArgs()`

Stubs the method only for the provided arguments.

This is useful to be more expressive in your assertions, where you can access the spy with the same call. It is also useful to create a stub that can act differently in response to different arguments.

Uses deep comparison for objects and arrays. Use `stub.withArgs(sinon.match.same(obj))` for strict comparison (see [matchers](/concepts/matchers/)).

<<< ../../../.vitepress/tests/docs/stubs/api/with-args.test.js
