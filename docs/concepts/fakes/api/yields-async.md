---
title: fake.yieldsAsync
description: Similar to [`fake.yields`][yields], `fake.yieldsAsync` also returns a function that when invoked, expects its last argument to be a callback, and invokes that callback with the same previously give...
---

# `fake.yieldsAsync([value1, ..., valueN]);`

Similar to [`fake.yields`][yields], `fake.yieldsAsync` also returns a function that when invoked, expects its last argument to be a callback, and invokes that callback with the same previously given values.

However, the returned function invokes that callback asynchronously rather than immediately, i.e. in the next event loop.

<<< ../../../.vitepress/tests/docs/fakes/api/yields-async.test.js

[yields]: ./yields
