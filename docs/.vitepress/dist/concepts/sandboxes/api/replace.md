---
url: /concepts/sandboxes/api/replace.md
description: Replaces `property` on `object` with `replacement` argument.
---

# `sandbox.replace(object, property, replacement);`

Replaces `property` on `object` with `replacement` argument.

Attempting to replace an already replaced value causes an exception.

Returns the `replacement`.

`replacement` can be any value, including [`fakes`](/concepts/fakes/), [`spies`](/concepts/spies/) and [`stubs`](/concepts/stubs/).

This method only works on non-accessor properties, for replacing accessors use [`sandbox.replaceGetter()`](./replace-getter) and [`sandbox.replaceSetter()`](./replace-setter).

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("sandbox.replace - basic usage", (t) => {
  // The sinon root object is a default sandbox
  var myObject = {
    myMethod: function () {
      return "apple pie";
    }
  };

  sinon.replace(myObject, "myMethod", function () {
    return "strawberry";
  });

  const result = myObject.myMethod();
  t.equal(result, "strawberry", "method replaced with strawberry");

  sinon.restore();

  t.end();
});

```
