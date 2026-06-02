---
title: assert.callOrder
description: Passes, when provided [`fakes`][fakes], [`spies`][spies] or [`stubs`][stubs] are called in the specified order.
---

# `assert.callOrder(spy1, spy2, ...);`

Passes, when provided [`fakes`][fakes], [`spies`][spies] or [`stubs`][stubs] are called in the specified order.

```js
import * as sinon from "sinon";
const fake = sinon.fake();
const spy = sinon.spy();
const stub = sinon.stub();

fake();
spy();
stub();

// not the called order
sinon.assert.callOrder(spy, stub, fake);
// => Uncaught: Error [AssertError]: expected spy, stub, fake to be called in order but were called as fake, spy, stub

// the called order - generates no error
sinon.assert.callOrder(fake, spy, stub);
```

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/call-order.test.js

[fakes]: /concepts/fakes/
[spies]: /concepts/spies/
[stubs]: /concepts/stubs/
