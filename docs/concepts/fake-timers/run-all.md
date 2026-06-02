---
title: clock.runAll()
description: Runs all pending timers until there are none remaining. Use runAllAsync for promise-based callbacks.
---

# `clock.runAll()` / `await clock.runAllAsync()`

This runs all pending timers until there are none remaining. If new timers are added while it is executing they will be run as well.

This makes it easier to run asynchronous tests to completion without worrying about the number of timers they use, or the delays in those timers.

The `runAllAsync()` will also break the event loop, allowing any scheduled promise callbacks to execute _before_ running the timers.

<<< ../../.vitepress/tests/docs/fake-timers/api-1.test.js
