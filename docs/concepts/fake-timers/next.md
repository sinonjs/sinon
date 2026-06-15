---
title: clock.next()
description: Advances the clock to the next scheduled timer and fires it. Use nextAsync for promise-based callbacks.
---

# `clock.next()` / `await clock.nextAsync()`

Advances the clock to the the moment of the first scheduled timer, firing it.

The `nextAsync()` will also break the event loop, allowing any scheduled promise callbacks to execute _before_ running the timers.

<<< ../../.vitepress/tests/docs/fake-timers/api/next.test.js
