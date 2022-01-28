---
layout: page
title: Utilities - Sinon.JS
breadcrumb: utilities
---

Sinon.JS has a few utilities used internally in `lib/sinon.js`. Unless the method in question is documented here, it should not be considered part of the public API, and thus is subject to change.

## Utils API

#### `sinon.restore(object);`

Restores all fake methods of supplied object

```javascript
    sinon.stub(obj);

    // run tests...

    sinon.restore(obj);
```

#### `sinon.restore(method);`

Restores supplied method

```javascript
    sinon.restore(obj.someMethod);
```

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

#### `sinon.format(object);`

Formats an object for pretty printing in error messages using [formatio](https://github.com/busterjs/formatio). Feel free to
override this method with your own implementation if you prefer different
visualization of e.g. objects. The method should return a string.
