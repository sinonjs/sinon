---
title: spyCall.returned
description: Returns `true`, when the spied function returned the provided `value` on this call.
---

# `spyCall.returned(value);`

Returns `true`, when the spied function returned the provided `value` on this call.

Uses deep comparison for objects and arrays. Use `spyCall.returned(sinon.match.same(obj))` for strict comparison (see [matchers](/concepts/matchers/)).

<<< ../../../.vitepress/tests/docs/spy-call/api/returned.test.js
