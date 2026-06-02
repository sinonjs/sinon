---
url: /concepts/stubs/api/yields-to-on.md
description: >-
  Causes the spy to invoke a callback passed as a property of an object to the
  spy.
---

# `stub.yieldsToOn()`

Causes the spy to invoke a callback passed as a property of an object to the spy.

`yieldsToOn` grabs the first matching argument, finds the callback and calls it, passing the [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) context and any (optional) arguments.

```js
import t from "tap";
import sinon from "sinon";

t.test("stub.yieldsToOn invokes callback with specified this context", (t) => {
  const obj = {
    hello: sinon.fake()
  };
  const obj2 = {
    item: "Apple Pie"
  };

  const stub = sinon.stub().yieldsToOn("hello", obj2);

  stub(obj);

  // Verify the callback was invoked with correct context
  t.ok(obj.hello.calledOnce, "hello callback should be called once");
  t.ok(
    obj.hello.calledOn(obj2),
    "hello should be called with obj2 as this context"
  );
  t.equal(obj.hello.firstCall.thisValue, obj2, "this should be obj2");

  t.end();
});

```

## See also

* [stub.yields](./yields)
* [stub.yieldsAsync](./yields-async)
* [stub.yieldsOn](./yields-on)
* [stub.yieldsOnAsync](./yields-on-async)
* [stub.yieldsRight](./yields-right)
* [stub.yieldsTo](./yields-to)
* [stub.yieldsToAsync](./yields-to-async)
* [stub.yieldsToOnAsync](./yields-to-on-async)

## More information

* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
