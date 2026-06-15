---
title: sandbox.useFakeTimers
description: Fakes the native timers and binds the `clock` object to the sandbox so it is restored when calling `sandbox.restore()`.
---

# `sandbox.useFakeTimers();`

Fakes the native timers and binds the `clock` object to the sandbox so it is restored when calling `sandbox.restore()`.

Access `clock` through the returned object.

<<< @/.vitepress/tests/docs/sandboxes/api/use-fake-timers.test.js
