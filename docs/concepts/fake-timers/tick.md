---
title: clock.tick(time)
description: Advances the clock by the specified time in milliseconds. Supports human-readable strings like "01:00" and Temporal.Duration objects.
---

# `clock.tick(time)` / `await clock.tickAsync(time)`

Tick the clock ahead `time` milliseconds.

Causes all timers scheduled within the affected time range to be called. `time` may be the number of milliseconds to advance the clock by, a human-readable string, or a `Temporal.Duration` object. Valid string formats are "08" for eight seconds, "01:00" for one minute and "02:34:10" for two hours, 34 minutes and ten seconds.

```javascript
clock.tick(Temporal.Duration.from({ hours: 1, minutes: 30 }));
```

The `tickAsync()` will also break the event loop, allowing any scheduled promise callbacks to execute _before_ running the timers.

<<< ../../.vitepress/tests/docs/fake-timers/api/tick.test.js
