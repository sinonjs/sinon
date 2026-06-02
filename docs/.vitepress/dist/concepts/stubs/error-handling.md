---
url: /concepts/stubs/error-handling.md
description: >-
  Stubs validate their usage and throw errors when used incorrectly. Learn about
  common stub errors and how to fix them.
---

# Error Handling in Stubs

Stubs validate their usage and throw errors when used incorrectly. Understanding these errors helps you use stubs properly.

## ES Modules Cannot Be Stubbed

Stubs cannot be created on ES Modules because their exports are read-only.

```javascript
import * as myModule from "./my-module.js";

// This will throw: "ES Modules cannot be stubbed"
sinon.stub(myModule, "someMethod");
```

**Solution:** Use CommonJS modules or stub individual imported functions:

```javascript
import { someMethod } from "./my-module.js";

// Create a wrapper object to stub
const wrapper = { someMethod };
sinon.stub(wrapper, "someMethod");
```

Or use `sinon.replace()`:

```javascript
import * as myModule from "./my-module.js";
import * as sinon from "sinon";

const fake = sinon.fake.returns("mocked value");
sinon.replace(myModule, "someMethod", fake);
```

## Removed Three-Argument Form

The three-argument form `stub(obj, 'method', func)` has been removed in modern Sinon versions.

```javascript
const obj = {
  method() {
    return "original";
  }
};

// This will throw: "stub(obj, 'meth', fn) has been removed, see documentation"
sinon.stub(obj, "method", function () {
  return "replacement";
});
```

**Solution:** Use `callsFake()` instead:

```javascript
const obj = {
  method() {
    return "original";
  }
};

// Correct approach
sinon.stub(obj, "method").callsFake(function () {
  return "replacement";
});
```

## Stubbing Non-Existent Properties

Attempting to stub a property that doesn't exist will fail.

```javascript
const obj = { existingMethod() {} };

// This may throw an error or behave unexpectedly
sinon.stub(obj, "nonExistentMethod");
```

**Solution:** Ensure the property exists first, or use `sinon.replace()`:

```javascript
const obj = { existingMethod() {} };

// Add the method first
obj.nonExistentMethod = function () {};
sinon.stub(obj, "nonExistentMethod");

// Or use replace which handles non-existent properties
sinon.replace(obj, "nonExistentMethod", sinon.stub());
```

## Stubbing Non-Function Properties

Stubs can only replace functions, not regular properties.

```javascript
const obj = { name: "Alice" };

// This will throw an error
sinon.stub(obj, "name");
```

**Solution:** Use `sinon.stub().get()` or `sinon.stub().value()` for properties:

```javascript
const obj = { name: "Alice" };

// For getter/setter
sinon.stub(obj, "name").get(() => "Bob");

// Or use value() for simple replacement
sinon.stub(obj, "name").value("Bob");
```

## Restoring Stubs

Forgetting to restore stubs can cause test pollution.

```javascript
const obj = {
  method() {
    return "original";
  }
};
sinon.stub(obj, "method").returns("stubbed");

// If you don't restore, subsequent tests will see the stub
obj.method(); // Still returns 'stubbed'
```

**Solution:** Always restore stubs:

```javascript
const obj = {
  method() {
    return "original";
  }
};
const stub = sinon.stub(obj, "method").returns("stubbed");

// Manual restore
stub.restore();

// Or use sinon.restore() to restore all stubs
sinon.stub(obj, "method").returns("stubbed");
sinon.restore(); // Restores all stubs created via sinon.stub()

// Or use test framework hooks
afterEach(() => {
  sinon.restore();
});
```

## Behavior Definition After Calls

Some behavior changes only affect future calls, not past ones.

```javascript
const stub = sinon.stub().returns("first");
stub(); // returns 'first'

stub.returns("second");
stub(); // returns 'second', not 'first'

// But this doesn't change the recorded call data
stub.getCall(0).returnValue; // Still 'first'
```

**This is expected behavior:** Stubs record call information immutably, but their behavior can change for future calls.

## Conflicting Behaviors

Using multiple behavior methods can be confusing:

```javascript
const stub = sinon.stub().returns("A").returns("B");

stub(); // What does this return?
```

**Result:** Returns 'B' - the last `returns()` call wins.

**Solution:** Use `onCall()` for sequential behaviors:

```javascript
const stub = sinon
  .stub()
  .onFirstCall()
  .returns("A")
  .onSecondCall()
  .returns("B");

stub(); // 'A'
stub(); // 'B'
```

## Best Practices

1. **Always restore** - Use `afterEach(() => sinon.restore())` in tests
2. **Use fakes for simple cases** - Reserve stubs for complex scenarios
3. **Be explicit with behavior** - Use `onCall()` for sequential, `withArgs()` for conditional
4. **Verify stubs exist** - Check property exists before stubbing
5. **Prefer `callsFake()`** - More flexible than old three-argument form
6. **Use property stubbing correctly** - `.get()`, `.set()`, or `.value()` for properties

## See Also

* [Stub API Documentation](./api/)
* [Migrating to Fakes](./migrating-to-fakes)
* [Fakes Error Handling](/concepts/fakes/error-handling)
* [Spy Error Handling](/concepts/spies/error-handling)
