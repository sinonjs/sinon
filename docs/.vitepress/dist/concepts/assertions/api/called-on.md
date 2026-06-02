---
url: /concepts/assertions/api/called-on.md
description: >-
  Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called at
  least once with `object` as `this`.
---

# `assert.calledOn(spyOrSpyCall, object);`

Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called at least once with `object` as `this`.

It's possible to assert on a dedicated spy call: `sinon.assert.calledOn(call, arg1, arg2, ...);`.

```js
import * as sinon from "sinon";
const spy = sinon.spy();
const object = {
  name: "Apple Pie"
};

// Has not been called yet, so the error message is a bit short :)
sinon.assert.calledOn(spy, object);
// => Uncaught: Error [AssertError]: expected spy to be called with { name: 'Apple Pie' } as this but was called with

spy.call(object);

// Generates no error
sinon.assert.calledOn(spy, object);

// Generates no error
sinon.assert.calledOn(spy.firstCall, object);
```

## Asserting on a `spyCall`

```js
import * as sinon from "sinon";
const spy = sinon.spy();
const object = {
  name: "Apple Pie"
};

spy.call(object);

// get a spyCall instance
const call = spy.firstCall;

// Generates no error
sinon.assert.calledOn(call, object);
```

See [`Function.prototype.call()`][proto-call].

## Example using test framework

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "assert.calledOn - passes when spy was called with correct this context",
  (t) => {
    const obj = { name: "test object" };
    const fake = sinon.fake();

    fake.call(obj);

    t.doesNotThrow(() => {
      sinon.assert.calledOn(fake, obj);
    }, "assertion should pass");

    t.end();
  }
);

tap.test("assert.calledOn - fails when spy was not called", (t) => {
  const obj = { name: "test object" };
  const fake = sinon.fake();

  t.throws(
    () => sinon.assert.calledOn(fake, obj),
    /expected fake to be called with/,
    "assertion should fail when not called"
  );

  t.end();
});

tap.test(
  "assert.calledOn - fails when spy was called with different this context",
  (t) => {
    const obj1 = { name: "obj1" };
    const obj2 = { name: "obj2" };
    const fake = sinon.fake();

    fake.call(obj1);

    t.throws(
      () => sinon.assert.calledOn(fake, obj2),
      /expected fake to be called with/,
      "assertion should fail with wrong this context"
    );

    t.end();
  }
);

```

[proto-call]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call

[fake]: /concepts/fakes/

[spy]: /concepts/spies/

[stub]: /concepts/stubs/
