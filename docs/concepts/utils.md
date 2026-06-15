---
title: Utilities
description: Internal utilities like createStubInstance and restoreObject. May change without notice.
---

# Utilities

Sinon.JS has a few utilities used internally in `lib/sinon.js`. Unless the method in question is documented here, it should not be considered part of the public API, and thus is subject to change.

## Utils API

### `sinon.createStubInstance(constructor);`

Creates a new object with the given function as the prototype and stubs all implemented functions.

<<< ../.vitepress/tests/docs/utils-1.test.js

The given constructor function is not invoked. See also the [stub API](/concepts/stubs/).

### `sinon.restoreObject(object);`

Restores all methods of an object and returns the restored object.

<<< ../.vitepress/tests/docs/utils-2.test.js

Throws an error if the object contains no restorable methods (spies, stubs, etc).

<<< ../.vitepress/tests/docs/utils-3.test.js

Throws an error if the object contains no restorable methods (spies, stubs, etc).
