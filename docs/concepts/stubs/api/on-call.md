---
title: stub.onCall
description: Defines the behavior of the stub on the _nth_ call. Useful for testing sequential interactions.
---

# `stub.onCall(index)`

Defines the behavior of the stub on the _nth_ call. Useful for testing sequential interactions.

<<< ../../../.vitepress/tests/docs/stubs/api/on-call-1.test.js

There are convenience methods [`onFirstCall`](./on-first-call), [`onSecondCall`](./on-second-call), [`onThirdCall`](./on-third-call) to improve readability of stub definitions.

`onCall` can be combined with all of the behavior defining methods in this API. In particular, it can be used together with `withArgs`.

<<< ../../../.vitepress/tests/docs/stubs/api/on-call-2.test.js

Note how the behavior of the stub for argument `FORTY_TWO` falls back to the default behavior once no more calls have been defined.
