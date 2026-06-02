---
url: /concepts/stubs/api/add-behavior.md
description: >-
  Add a custom behavior. The name will be available as a function on stubs, and
  the chaining mechanism will be set up for you (e.g. no need to return anything
  from your function, its return value wil...
---

# `stub.addBehavior(name, fn)`

Add a custom behavior. The name will be available as a function on stubs, and the chaining mechanism will be set up for you (e.g. no need to return anything from your function, its return value will be ignored). The `fn` will be passed the fake instance as its first argument, and then the user's arguments.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.addBehavior - custom behavior", (t) => {
  const name = "returnsNum";

  function fn(fake, n) {
    fake.returns(n);
  }

  sinon.addBehavior("returnsNum", fn);

  const stub = sinon.stub().returnsNum(42);

  const result = stub();

  t.equal(result, 42, "custom behavior returns 42");

  t.end();
});

```
