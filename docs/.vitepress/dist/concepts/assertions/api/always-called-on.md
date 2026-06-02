---
url: /concepts/assertions/api/always-called-on.md
description: >-
  Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] has only been
  called with `object` as its `this` value.
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

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "assert.alwaysCalledOn - passes when all calls have correct this context",
  (t) => {
    const obj = { name: "test object" };
    const fake = sinon.fake();

    fake.call(obj);
    fake.call(obj);

    t.doesNotThrow(() => {
      sinon.assert.alwaysCalledOn(fake, obj);
    }, "assertion should pass");

    t.end();
  }
);

tap.test(
  "assert.alwaysCalledOn - fails when one call has different this context",
  (t) => {
    const obj1 = { name: "obj1" };
    const obj2 = { name: "obj2" };
    const fake = sinon.fake();

    fake.call(obj1);
    fake.call(obj2);

    t.throws(
      () => sinon.assert.alwaysCalledOn(fake, obj1),
      /expected fake to always be called with/,
      "assertion should fail with different this context"
    );

    t.end();
  }
);

```

[proto-call]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call

[fake]: /concepts/fakes/

[spy]: /concepts/spies/

[stub]: /concepts/stubs/
