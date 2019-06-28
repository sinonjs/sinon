---
layout: page
title: Utilities - Sinon.JS
breadcrumb: utilities
---

Sinon.JS has a few utilities used internally in `lib/sinon.js`. Unless the method in question is documented here, it should not be considered part of the public API, and thus is subject to change.

## Utils API

#### `sinon.createStubInstance(constructor);`

Creates a new object with the given function as the protoype and stubs all implemented functions.

```javascript
    class Container {
        contains(item) { /* ... */ }
    }

    var stubContainer = sinon.createStubInstance(Container);
    stubContainer.contains.returns(false);
    stubContainer.contains.withArgs("item").returns(true);
```

The given constructor function is not invoked. See also the [stub API](../stubs).
