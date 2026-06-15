---
title: Error Handling
description: Fakes validate their usage and throw errors when used incorrectly. Learn about common fakes errors and how to fix them.
weight: 20
---

# Error Handling in Fakes

Fakes validate their usage and throw errors when used incorrectly. Understanding these errors helps you use fakes correctly.

## Creating Fakes

### Invalid Argument Type

When creating a fake with `sinon.fake(f)`, if you provide an argument, it must be a function.

<<< ../../.vitepress/tests/docs/fakes/_index-3.test.js

## Yield Methods

### Missing Callback

Both `fake.yields()` and `fake.yieldsAsync()` expect the last argument to be a callback function. If you call the fake without a callback, it will throw an error.

**For `fake.yields()`:**

<<< ../../.vitepress/tests/docs/fakes/api/yields.test.js

**For `fake.yieldsAsync()`:**

<<< ../../.vitepress/tests/docs/fakes/api/yields-async.test.js

## Best Practices

1. **Always provide callbacks** - When using `fake.yields()` or `fake.yieldsAsync()`, ensure the fake is called with a callback as the last argument
2. **Type check arguments** - Only pass functions to `sinon.fake()` when wrapping behavior
3. **Use empty fakes** - If you don't need specific behavior, call `sinon.fake()` without arguments to create an empty fake
