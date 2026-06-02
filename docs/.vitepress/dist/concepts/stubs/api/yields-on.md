---
url: /concepts/stubs/api/yields-on.md
description: >-
  Causes the stub to call the first callback it receives with any provided
  arguments, with an additional parameter to pass the
  [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
---

# `stub.yieldsOn()`

Causes the stub to call the first callback it receives with any provided arguments, with an additional parameter to pass the [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) context.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.yieldsOn - basic usage", (t) => {
  const person = {
    name: "Mickey Mouse"
  };

  const stub = sinon.stub().yieldsOn(person);
  let capturedThis;

  function hello() {
    capturedThis = this;
  }

  stub(hello);

  t.equal(capturedThis, person, "callback called with person as this");
  t.equal(capturedThis.name, "Mickey Mouse", "this.name is Mickey Mouse");

  t.end();
});

```

## See also

* [stub.yields](./yields)
* [stub.yieldsAsync](./yields-async)
* [stub.yieldsOnAsync](./yields-on-async)
* [stub.yieldsRight](./yields-right)
* [stub.yieldsTo](./yields-to)
* [stub.yieldsToOn](./yields-to-on)
* [stub.yieldsToAsync](./yields-to-async)
* [stub.yieldsToOnAsync](./yields-to-on-async)

## More information

* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
