---
url: /concepts/stubs/api/value.md
description: Defines a new value for this stub.
---

# `stub.value(newVal)`

Defines a new value for this stub.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.value - basic usage", (t) => {
  const myObj = {
    example: "oldValue"
  };

  sinon.stub(myObj, "example").value("newValue");

  t.equal(myObj.example, "newValue", "property has new value");

  sinon.restore();
  t.end();
});

```

## Restoring values

You can restore values by calling the `restore` method:

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.value - restoring values", (t) => {
  const myObj = {
    example: "oldValue"
  };

  const stub = sinon.stub(myObj, "example").value("newValue");
  t.equal(myObj.example, "newValue", "property has new value");

  stub.restore();

  t.equal(myObj.example, "oldValue", "property restored to old value");

  t.end();
});

```
