---
url: /concepts/sandboxes/api/replace-getter.md
description: >-
  Replaces getter for `property` on `object` with `replacement` argument.
  Attempting to replace an already replaced getter causes an exception.
---

# `sandbox.replaceGetter();`

Replaces getter for `property` on `object` with `replacement` argument. Attempting to replace an already replaced getter causes an exception.

`replacement` must be a `Function`, and can be instances of [`fake`](/concepts/fakes/), [`spy`](/concepts/spies/) and [`stub`](/concepts/stubs/).

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("sandbox.replaceGetter - basic usage", (t) => {
  // The sinon root object is a default sandbox
  const object = {
    get myProperty() {
      return "apple pie";
    }
  };

  sinon.replaceGetter(object, "myProperty", function () {
    return "strawberry";
  });

  t.equal(object.myProperty, "strawberry", "getter replaced");

  sinon.restore();

  t.end();
});

```
