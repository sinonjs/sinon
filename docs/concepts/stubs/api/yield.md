---
title: stub.yield
description: Invoke callbacks passed to the `stub` with the given argument(s).
---

# `stub.yield()`

Invoke callbacks passed to the `stub` with the given argument(s).

<<< ../../../.vitepress/tests/docs/stubs/api/yield-1.test.js

If the stub was never called with a function argument, `yield` throws an error.

<<< ../../../.vitepress/tests/docs/stubs/api/yield-2.test.js

Returns an Array with all callbacks return values, in the order the callbacks were called.

<<< ../../../.vitepress/tests/docs/stubs/api/yield-3.test.js

`yield` is aliased as `invokeCallback`.

<<< ../../../.vitepress/tests/docs/stubs/api/yield-4.test.js

## See also

- [`yieldTo`](./yield-to)
