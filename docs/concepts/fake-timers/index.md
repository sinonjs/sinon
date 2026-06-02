---
title: Fake timers
description: Replace setTimeout, setInterval, and Date with controllable fake implementations for time-based testing.
---

# Fake timers

Fake timers are synchronous implementations of `setTimeout` and friends that
Sinon.JS can overwrite the global functions with to allow you to more easily
test code using them.

Fake timers provide a `clock` object to pass time, which can also be used to control `Date` objects created through either `new Date();`
or `Date.now();` (if supported by the browser).

For standalone usage of fake timers it is recommended to use [fake-timers](https://github.com/sinonjs/fake-timers) package instead. It provides the same
set of features (Sinon uses it under the hood) and was previously extracted from Sinon.JS.
