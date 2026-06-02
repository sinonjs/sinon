---
title: assert.alwaysCalledOn
description: Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] has only been called with `object` as its `this` value.
---

# `assert.alwaysCalledOn(spyOrSpyCall, object);`

Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] has only been called with `object` as its `this` value.

```js
import * as sinon from "sinon";
const spy = sinon.spy();
const object = {
  name: "Apple Pie"
};
const differentObject = {
  name: "Cherry Pie"
};

// Has not been called yet, so the error message is a bit short :)
sinon.assert.alwaysCalledOn(spy, object);
// => Uncaught: Error [AssertError]: expected spy to be called with { name: 'Apple Pie' } as this but was called with

spy.call(object);

// Generates no error
sinon.assert.alwaysCalledOn(spy, object);

spy.call(differentObject);

sinon.assert.alwaysCalledOn(spy, object);
// => Uncaught: Error [AssertError]: expected spy to always be called with { name: 'Apple Pie' } as this but was called with { name: 'Apple Pie' }, { name: 'Cherry Pie' }
```

See [`Function.prototype.call()`][proto-call].

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/always-called-on.test.js

[proto-call]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
[fake]: /concepts/fakes/
[spy]: /concepts/spies/
[stub]: /concepts/stubs/
