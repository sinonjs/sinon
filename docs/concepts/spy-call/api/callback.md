---
title: spyCall.callback
description: This property is a convenience for a call's callback.
---

# `spyCall.callback`

This property is a convenience for a call's callback.

When the last argument in a call is a `Function`, then `callback` will reference that. Otherwise it will be `undefined`.

<<< ../../../.vitepress/tests/docs/spy-call/api/callback.test.js
