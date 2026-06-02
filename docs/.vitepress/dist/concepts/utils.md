---
url: /concepts/utils.md
description: >-
  Internal utilities like createStubInstance and restoreObject. May change
  without notice.
---

# Utilities

Sinon.JS has a few utilities used internally in `lib/sinon.js`. Unless the method in question is documented here, it should not be considered part of the public API, and thus is subject to change.

## Utils API

### `sinon.createStubInstance(constructor);`

Creates a new object with the given function as the prototype and stubs all implemented functions.

```js
import t from "tap";
import sinon from "sinon";

t.test("createStubInstance stubs all implemented functions", (t) => {
  class Container {
    contains(item) {
      /* ... */
    }
  }

  const stubContainer = sinon.createStubInstance(Container);
  stubContainer.contains.returns(false);
  stubContainer.contains.withArgs("item").returns(true);

  // Verify the stubbed behavior works as configured
  t.equal(
    stubContainer.contains("other"),
    false,
    "contains should return false by default"
  );
  t.equal(
    stubContainer.contains("item"),
    true,
    "contains should return true for 'item'"
  );

  // Verify it's actually a stub
  t.ok(stubContainer.contains.calledTwice, "contains should be called twice");
  t.type(
    stubContainer,
    Container,
    "stubContainer should be instance of Container"
  );

  t.end();
});

```

The given constructor function is not invoked. See also the [stub API](/concepts/stubs/).

### `sinon.restoreObject(object);`

Restores all methods of an object and returns the restored object.

```js
import t from "tap";
import sinon from "sinon";

t.test("restoreObject restores all methods and returns the object", (t) => {
  const obj = {
    foo: () => {}
  };

  const originalFoo = obj.foo;

  // Wrap method with spy
  sinon.spy(obj, "foo");

  // Verify method is now a spy
  t.ok(obj.foo.restore, "foo should have restore method (is wrapped)");

  // Restore the object
  const result = sinon.restoreObject(obj);

  // Verify restoration
  t.equal(result, obj, "should return the restored object");
  t.notOk(obj.foo.restore, "foo should no longer have restore method");
  t.equal(obj.foo, originalFoo, "foo should be restored to original");

  t.end();
});

```

Throws an error if the object contains no restorable methods (spies, stubs, etc).

```js
import t from "tap";
import sinon from "sinon";

t.test("restoreObject throws when object has no restorable methods", (t) => {
  const emptyObj = {};

  // Verify it throws an error
  t.throws(
    () => sinon.restoreObject(emptyObj),
    /no methods/i,
    "should throw error about no methods to restore"
  );

  t.end();
});

```

Throws an error if the object contains no restorable methods (spies, stubs, etc).
