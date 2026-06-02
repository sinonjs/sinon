---
url: /concepts/spies/error-handling.md
description: >-
  Spies validate their usage and throw errors when used incorrectly. Learn about
  common spy errors and how to fix them.
---

# Error Handling in Spies

Spies validate their usage and throw errors when used incorrectly. Understanding these errors helps you use spies properly.

## ES Modules Cannot Be Spied

Spies cannot be created on ES Modules because their exports are read-only.

```javascript
import * as myModule from "./my-module.js";

// This will throw: "ES Modules cannot be spied"
sinon.spy(myModule);
```

**Solution:** Use individual exports or CommonJS modules if you need to spy on module exports.

## Yield Methods Called Before Invocation

Methods like `yield()`, `yieldOn()`, `yieldTo()`, and `yieldToOn()` can only be called after the spy has been invoked at least once.

```javascript
const spy = sinon.spy();

// This will throw: "spy cannot yield since it was not yet invoked"
spy.yield();
```

**Solution:** Call the spy first, then use yield methods on the call object:

```javascript
const spy = sinon.spy();
function callback(value) {
  /* ... */
}

spy(callback);
spy.getCall(0).yield("value"); // Works!
```

## CallArg Methods Called Before Invocation

Methods like `callArg()`, `callArgWith()`, `callArgOn()`, and `callArgOnWith()` require the spy to have been called first.

```javascript
const spy = sinon.spy();

// This will throw: "spy cannot call arg since it was not yet invoked"
spy.callArg(0);
```

**Solution:** Call the spy first, then use callArg methods on the call object:

```javascript
const spy = sinon.spy();
function callback() {
  /* ... */
}

spy(callback);
spy.getCall(0).callArg(0); // Works!
```

## Best Practices

1. **Check for calls before accessing call data** - Use `spy.called` or `spy.callCount` before accessing `spy.getCall(n)`
2. **Use appropriate spy type** - Choose anonymous spies, method wrappers, or property accessors based on your needs
3. **Restore spies** - Always restore spies with `spy.restore()` to clean up
4. **Consider using fakes** - For new code, `sinon.fake()` provides a simpler API with the same functionality

## See Also

* [Spy API Documentation](./api/)
* [Migrating to Fakes](./migrating-to-fakes)
* [Fakes Error Handling](/concepts/fakes/error-handling)
