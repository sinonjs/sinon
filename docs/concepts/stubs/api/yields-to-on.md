---
title: stub.yieldsToOn
description: Causes the spy to invoke a callback passed as a property of an object to the spy.
---

# `stub.yieldsToOn()`

Causes the spy to invoke a callback passed as a property of an object to the spy.

`yieldsToOn` grabs the first matching argument, finds the callback and calls it, passing the [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) context and any (optional) arguments.

<<< ../../../.vitepress/tests/docs/stubs/api/yields-to-on.test.js

## See also

- [stub.yields](./yields)
- [stub.yieldsAsync](./yields-async)
- [stub.yieldsOn](./yields-on)
- [stub.yieldsOnAsync](./yields-on-async)
- [stub.yieldsRight](./yields-right)
- [stub.yieldsTo](./yields-to)
- [stub.yieldsToAsync](./yields-to-async)
- [stub.yieldsToOnAsync](./yields-to-on-async)

## More information

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
