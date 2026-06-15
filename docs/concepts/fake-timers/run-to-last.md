---
title: clock.runToLast()
description: Runs all pending timers until the last timer has been fired. Use runToLastAsync for promise-based callbacks.
---

# `clock.runToLast()` / `await clock.runToLastAsync()`

This runs all pending timers until the last timer has been fired. If new timers are added while it is executing they will be run as well.

The `runToLastAsync()` will also break the event loop, allowing any scheduled promise callbacks to execute _before_ running the timers.
