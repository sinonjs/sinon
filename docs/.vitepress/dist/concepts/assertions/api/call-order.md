---
url: /concepts/assertions/api/call-order.md
description: >-
  Passes, when provided [`fakes`][fakes], [`spies`][spies] or [`stubs`][stubs]
  are called in the specified order.
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

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.callOrder - passes when spies called in order", (t) => {
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  const spy3 = sinon.spy();

  spy1();
  spy2();
  spy3();

  t.doesNotThrow(() => {
    sinon.assert.callOrder(spy1, spy2, spy3);
  }, "assertion should pass when called in order");

  t.end();
});

tap.test("assert.callOrder - fails when spies called out of order", (t) => {
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  const spy3 = sinon.spy();

  spy3();
  spy1();
  spy2();

  t.throws(
    () => sinon.assert.callOrder(spy1, spy2, spy3),
    /expected.*to be called in order/,
    "assertion should fail when called out of order"
  );

  t.end();
});

tap.test("assert.callOrder - works with subset of spies", (t) => {
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();

  spy1();
  spy2();

  t.doesNotThrow(() => {
    sinon.assert.callOrder(spy1, spy2);
  }, "assertion should pass when spies called in order");

  t.end();
});

```

[fakes]: /concepts/fakes/

[spies]: /concepts/spies/

[stubs]: /concepts/stubs/
