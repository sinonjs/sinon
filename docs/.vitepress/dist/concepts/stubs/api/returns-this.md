---
url: /concepts/stubs/api/returns-this.md
description: Causes the stub to return its <code>this</code> value.
---

# `stub.returnsThis()`

Causes the stub to return its this value.

Useful for stubbing fluent APIs (jQuery style).

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.returnsThis", (t) => {
  const myObj = {
    one: function () {},
    two: function () {
      return "apple pie";
    }
  };

  const stub = sinon.stub(myObj, "one").returnsThis();

  t.equal(myObj.one().two(), "apple pie", "stub returns this for chaining");

  stub.restore();
  t.end();
});

```
