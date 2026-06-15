---
title: spy.thisValues
description: Array of `this` objects, `spy.thisValues[0]` is the [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) object for the first [call](/concepts/spy-call/).
---

# `spy.thisValues`

Array of `this` objects, `spy.thisValues[0]` is the [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) object for the first [call](/concepts/spy-call/).

<<< ../../../.vitepress/tests/docs/spies/api/this-values.test.js

See [`Function.prototype.call()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call).

## Resetting `thisValues` to default

You can reset `thisValues` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
