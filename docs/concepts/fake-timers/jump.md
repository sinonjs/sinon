---
title: clock.jump(time)
description: Advance the clock by jumping forward in time, firing callbacks at most once. Useful for simulating a JS engine being put to sleep.
---

# `clock.jump(time)`

Advance the clock by jumping forward in time, firing callbacks at most once.
`time` takes the same formats as [`clock.tick`](./tick).

This can be used to simulate the JS engine (such as a browser) being put to sleep and resumed later, skipping intermediary timers.

<<< ../../.vitepress/tests/docs/fake-timers/api/jump.test.js
