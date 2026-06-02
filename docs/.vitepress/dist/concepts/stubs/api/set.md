---
url: /concepts/stubs/api/set.md
description: Replaces a setter for an object property.
---

# `stub.set(setterFn)`

Replaces a setter for an object property.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.set", (t) => {
  const myObj = {
    example: "oldValue",
    prop: "foo"
  };

  sinon.stub(myObj, "prop").set(function setterFn(val) {
    myObj.example = val;
  });

  myObj.prop = "baz";

  t.equal(myObj.example, "baz", "setter updates the example property");

  sinon.restore();
  t.end();
});

```

## More information

* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set
