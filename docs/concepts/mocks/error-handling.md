---
title: Error Handling
description: Mocks throw errors when expectations aren't met or when used incorrectly. Learn about common mock errors and how to fix them.
weight: 20
---

# Error Handling in Mocks

Mocks have strict verification requirements and will throw errors when expectations aren't met or when used incorrectly. Understanding these errors is essential for effective mock usage.

## Null or Undefined Object

Attempting to create a mock for a null or undefined object will fail.

```javascript
// This will throw: "object is null"
sinon.mock(null);
sinon.mock(undefined);
```

**Solution:** Provide a valid object:

```javascript
const obj = { method() {} };
const mock = sinon.mock(obj);
```

## Falsy Method Name

Setting an expectation on a falsy method name will fail.

```javascript
const mock = sinon.mock(obj);

// This will throw: "method is falsy"
mock.expects(null);
mock.expects(undefined);
mock.expects("");
```

**Solution:** Provide a valid method name:

```javascript
mock.expects("validMethodName");
```

## Unmet Expectations

The most common mock error: calling `verify()` when expectations aren't met.

```javascript
const obj = { greet() {} };
const mock = sinon.mock(obj);

mock.expects("greet").once();
// greet is never called

mock.verify(); // Throws: "Expected greet(...) once (never called)"
```

**Error message includes:**

- Which expectation failed
- How many times it was expected
- How many times it was actually called

**Solution:** Ensure all expectations are met:

```javascript
const obj = { greet() {} };
const mock = sinon.mock(obj);

mock.expects("greet").once();
obj.greet(); // Call the method
mock.verify(); // Now succeeds
```

## Unexpected Calls

Calling a mocked method in a way that doesn't match any expectations will fail immediately.

```javascript
const obj = { greet(name) {} };
const mock = sinon.mock(obj);

mock.expects("greet").withExactArgs("Alice");

// This throws immediately: "Unexpected call: greet(Bob)"
obj.greet("Bob");
```

**Error message includes:**

- The unexpected call details
- All defined expectations
- Stack trace for debugging

**Solution:** Either adjust the expectation or fix the call:

```javascript
// Option 1: Use withArgs instead of withExactArgs
mock.expects("greet").withArgs("Alice"); // Also accepts more args

// Option 2: Match the expectation exactly
obj.greet("Alice"); // Now matches

// Option 3: Add multiple expectations
mock.expects("greet").withExactArgs("Alice");
mock.expects("greet").withExactArgs("Bob");
```

## Verify Auto-Restores

An important behavior: `mock.verify()` automatically calls `mock.restore()`.

```javascript
const obj = {
  method() {
    return "original";
  }
};
const mock = sinon.mock(obj);

mock.expects("method").once();
obj.method();

mock.verify(); // Verifies AND restores

// Method is now restored
obj.method(); // Returns 'original', not a mock
```

**This is by design.** The expectation is that verify is your last action with the mock.

**Problem:** Calling verify() twice will fail on the second call:

```javascript
mock.verify(); // First call succeeds and restores
mock.verify(); // Second call throws - mock is already restored
```

**Solution:** Only call `verify()` once per mock, typically in test cleanup:

```javascript
afterEach(() => {
  mock.verify(); // Verify once at the end
});
```

## Overwriting Expectations

Setting multiple expectations with `withArgs()` or `withExactArgs()` on the same expectation will overwrite previous arguments.

```javascript
const mock = sinon.mock(obj);
const expectation = mock.expects("method");

expectation.withArgs("first");
expectation.withArgs("second"); // Overwrites 'first'

obj.method("first"); // Fails! Expectation now requires 'second'
```

**This is documented behavior:** An expectation holds only one set of arguments.

**Solution:** Create multiple expectations for different arguments:

```javascript
const mock = sinon.mock(obj);
mock.expects("method").withArgs("first");
mock.expects("method").withArgs("second");

obj.method("first"); // Matches first expectation
obj.method("second"); // Matches second expectation
```

## Too Many Calls

Calling a method more times than expected will fail.

```javascript
const mock = sinon.mock(obj);
mock.expects("method").once();

obj.method(); // OK
obj.method(); // Throws: "Unexpected call: method()"
```

**Solution:** Adjust expectation or use `atLeast()`:

```javascript
// Option 1: Set correct count
mock.expects("method").twice();

// Option 2: Use atLeast for minimum
mock.expects("method").atLeast(1); // Allows 1 or more

// Option 3: Use atMost for maximum
mock.expects("method").atMost(2); // Allows 0, 1, or 2
```

## Debugging Mock Failures

When mock expectations fail, the error messages can be dense. Here's how to read them:

```javascript
Error: Expected greet('[...]') once (never called)
    greet(Bob) at MyTest.js:15
```

**Reading the error:**

1. **"Expected greet('[...]') once"** - The expectation
2. **"(never called)"** - What actually happened
3. **"greet(Bob) at MyTest.js:15"** - Stack trace of unexpected calls (if any)

**Debugging steps:**

1. Check the expectation: Is it correct?
2. Check the actual calls: Are they happening?
3. Check the arguments: Do they match?
4. Check the call count: Right number of calls?

## Best Practices

1. **One mock per test** - Multiple mocks make failures hard to diagnose
2. **Verify once** - Call `verify()` only once, in cleanup
3. **Expect only what matters** - Don't mock what you don't need to verify
4. **Use explicit assertions** - Consider fakes + assertions instead of mocks
5. **Test behavior, not implementation** - Avoid coupling tests to internal calls
6. **Clear error messages** - Use descriptive method names in tests

## Common Pitfalls

### Testing Implementation Details

```javascript
// BAD: Testing how the code works internally
mock.expects("_privateMethod").once();
mock.expects("helperFunction").twice();

// GOOD: Testing what the code does
const fake = sinon.fake.returns("result");
sinon.replace(obj, "publicMethod", fake);
// Assert on behavior, not internal calls
```

### Too Many Expectations

```javascript
// BAD: Every interaction is an expectation
mock.expects("log").atLeast(1);
mock.expects("validateInput").once();
mock.expects("processData").once();
mock.expects("sendResponse").once();

// GOOD: Only mock what you need to control or verify
const fake = sinon.fake.resolves("result");
sinon.replace(service, "getData", fake);
// Explicit assertions on behavior
assert.ok(fake.called);
```

### Brittle Tests

```javascript
// BAD: Test breaks when call order changes
mock.expects("a").once();
mock.expects("b").once();
mock.expects("c").once();
// Now code must call in exact order: a, b, c

// GOOD: Test the outcome, not the path
const result = await service.process();
assert.equal(result, expectedValue);
```

## See Also

- [Mock API Documentation](/concepts/mocks/)
- [When NOT to use mocks](./#when-to-not-use-mocks)
- [Mocks vs Stubs vs Fakes](./#mocks-vs-stubs-vs-fakes)
- [Migrating from Mocks](./migrating-from-mocks)
- [Martin Fowler: Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html)
