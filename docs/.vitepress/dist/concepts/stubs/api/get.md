---
url: /concepts/stubs/api/get.md
description: Replaces a getter for an object property.
---

# `stub.get(getterFn)`

Replaces a getter for an object property.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.get", (t) => {
  const myObj = {
    prop: "foo"
  };

  sinon.stub(myObj, "prop").get(function getterFn() {
    return "bar";
  });

  t.equal(myObj.prop, "bar", "getter returns stubbed value");

  sinon.restore();
  t.end();
});

```

## More information

* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
