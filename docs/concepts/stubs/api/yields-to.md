---
title: stub.yieldsTo
description: Causes the spy to invoke a callback passed as a property of an object to the spy.
---

# `stub.yieldsTo()`

Causes the spy to invoke a callback passed as a property of an object to the spy.

`yieldsTo` grabs the first matching argument, finds the callback and calls it with the (optional) arguments.

<<< ../../../.vitepress/tests/docs/stubs/api/yields-to.test.js

## See also

- [stub.yields](./yields)
- [stub.yieldsAsync](./yields-async)
- [stub.yieldsOn](./yields-on)
- [stub.yieldsOnAsync](./yields-on-async)
- [stub.yieldsRight](./yields-right)
- [stub.yieldsToOn](./yields-to-on)
- [stub.yieldsToAsync](./yields-to-async)
- [stub.yieldsToOnAsync](./yields-to-on-async)
