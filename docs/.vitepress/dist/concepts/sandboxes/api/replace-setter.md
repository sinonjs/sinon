---
url: /concepts/sandboxes/api/replace-setter.md
description: >-
  Replaces setter for `property` on `object` with `replacement` argument.
  Attempting to replace an already replaced setter causes an exception.
---

# `sandbox.replaceSetter();`

Replaces setter for `property` on `object` with `replacement` argument. Attempting to replace an already replaced setter causes an exception.

`replacement` must be a `Function`, and can be instances of [`fake`](/concepts/fakes/), [`spy`](/concepts/spies/) and [`stub`](/concepts/stubs/).

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("sandbox.replaceSetter - basic usage", (t) => {
  // The sinon root object is a default sandbox
  const object = {
    set myProperty(value) {
      this.prop = value;
    }
  };

  sinon.replaceSetter(object, "myProperty", function (value) {
    this.prop = "strawberry " + value;
  });

  object.myProperty = "pie";

  t.equal(object.prop, "strawberry pie", "setter replaced and called");

  sinon.restore();

  t.end();
});

```
