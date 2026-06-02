---
url: /concepts/stubs/api/yields-to.md
description: >-
  Causes the spy to invoke a callback passed as a property of an object to the
  spy.
---

# `stub.yieldsTo()`

Causes the spy to invoke a callback passed as a property of an object to the spy.

`yieldsTo` grabs the first matching argument, finds the callback and calls it with the (optional) arguments.

```js
import t from "tap";
import sinon from "sinon";

t.test("stub.yieldsTo invokes callback passed as object property", (t) => {
  const stub = sinon.stub().yieldsTo("hello", "Mickey Mouse");

  const obj = {
    hello: sinon.fake()
  };

  stub(obj);

  // Verify the callback was invoked with the correct arguments
  t.ok(obj.hello.calledOnce, "hello callback should be called once");
  t.ok(
    obj.hello.calledWith("Mickey Mouse"),
    "hello should be called with 'Mickey Mouse'"
  );

  t.end();
});

```

## See also

* [stub.yields](./yields)
* [stub.yieldsAsync](./yields-async)
* [stub.yieldsOn](./yields-on)
* [stub.yieldsOnAsync](./yields-on-async)
* [stub.yieldsRight](./yields-right)
* [stub.yieldsToOn](./yields-to-on)
* [stub.yieldsToAsync](./yields-to-async)
* [stub.yieldsToOnAsync](./yields-to-on-async)
