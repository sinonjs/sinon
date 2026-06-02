---
title: Migrating to Fakes
description: Guide for migrating from spies to fakes. Learn why fakes are preferred and see code examples for common migration patterns.
weight: 30
---

# Migrating from Spies to Fakes

[Fakes](/concepts/fakes/) are the modern, preferred alternative to spies. They provide the same functionality with a simpler, more consistent API. This guide shows how to migrate your code from spies to fakes.

## Why Migrate to Fakes?

1. **Immutable** - Fakes are immutable, avoiding confusion from mutable behavior
2. **Simpler API** - No need to understand stub vs spy differences
3. **Same spy API** - All spy properties and methods work on fakes
4. **Easier to use** - More intuitive patterns for common use cases

## Migration Patterns

### Anonymous Function Spies

**Before (Spy):**

```javascript
const spy = sinon.spy();
callback(spy);
assert(spy.calledOnce);
```

**After (Fake):**

```javascript
const fake = sinon.fake();
callback(fake);
assert(fake.calledOnce);
```

**Change:** Replace `sinon.spy()` with `sinon.fake()`

---

### Wrapping Functions

**Before (Spy):**

```javascript
function myFunc(x) {
  return x * 2;
}
const spy = sinon.spy(myFunc);
const result = spy(5);
assert.equal(result, 10);
assert(spy.calledWith(5));
```

**After (Fake):**

```javascript
function myFunc(x) {
  return x * 2;
}
const fake = sinon.fake(myFunc);
const result = fake(5);
assert.equal(result, 10);
assert(fake.calledWith(5));
```

**Change:** Replace `sinon.spy(func)` with `sinon.fake(func)`

---

### Wrapping Object Methods

**Before (Spy):**

```javascript
const obj = {
  method() {
    return "original";
  }
};
const spy = sinon.spy(obj, "method");
obj.method();
assert(spy.calledOnce);
spy.restore();
```

**After (Fake):**

```javascript
const obj = {
  method() {
    return "original";
  }
};
const fake = sinon.fake(obj.method);
sinon.replace(obj, "method", fake);
obj.method();
assert(fake.calledOnce);
sinon.restore();
```

**Change:** Use `sinon.replace()` to plug the fake into the object. This keeps creation separate from plugging in, following the single responsibility principle.

---

### Return Value Stubbing

**Before (Spy/Stub):**

```javascript
const stub = sinon.stub().returns(42);
const result = stub();
assert.equal(result, 42);
```

**After (Fake):**

```javascript
const fake = sinon.fake.returns(42);
const result = fake();
assert.equal(result, 42);
```

**Change:** Use `sinon.fake.returns(value)` for simple return values

---

### Throwing Errors

**Before (Spy/Stub):**

```javascript
const stub = sinon.stub().throws(new Error("Failed"));
assert.throws(() => stub());
```

**After (Fake):**

```javascript
const fake = sinon.fake.throws(new Error("Failed"));
assert.throws(() => fake());
```

**Change:** Use `sinon.fake.throws(error)` for throwing errors

---

### Promise Resolution

**Before (Spy/Stub):**

```javascript
const stub = sinon.stub().resolves("success");
await stub();
```

**After (Fake):**

```javascript
const fake = sinon.fake.resolves("success");
await fake();
```

**Change:** Use `sinon.fake.resolves(value)`

---

### Promise Rejection

**Before (Spy/Stub):**

```javascript
const stub = sinon.stub().rejects(new Error("Failed"));
try {
  await stub();
} catch (e) {
  assert.equal(e.message, "Failed");
}
```

**After (Fake):**

```javascript
const fake = sinon.fake.rejects(new Error("Failed"));
try {
  await fake();
} catch (e) {
  assert.equal(e.message, "Failed");
}
```

**Change:** Use `sinon.fake.rejects(error)`

---

### Callback Invocation (Sync)

**Before (Spy/Stub):**

```javascript
const stub = sinon.stub().yields("arg1", "arg2");
stub((a, b) => {
  assert.equal(a, "arg1");
  assert.equal(b, "arg2");
});
```

**After (Fake):**

```javascript
const fake = sinon.fake.yields("arg1", "arg2");
fake((a, b) => {
  assert.equal(a, "arg1");
  assert.equal(b, "arg2");
});
```

**Change:** Use `sinon.fake.yields(args...)`

---

### Callback Invocation (Async)

**Before (Spy/Stub):**

```javascript
const stub = sinon.stub().yieldsAsync("arg1", "arg2");
stub((a, b) => {
  assert.equal(a, "arg1");
  assert.equal(b, "arg2");
});
```

**After (Fake):**

```javascript
const fake = sinon.fake.yieldsAsync("arg1", "arg2");
fake((a, b) => {
  assert.equal(a, "arg1");
  assert.equal(b, "arg2");
});
```

**Change:** Use `sinon.fake.yieldsAsync(args...)`

## Key Differences

### Immutability

**Spies/Stubs (Mutable):**

```javascript
const stub = sinon.stub();
stub.returns(1); // Changes behavior
stub.returns(2); // Changes behavior again
```

**Fakes (Immutable):**

```javascript
const fake1 = sinon.fake.returns(1); // Fixed behavior
const fake2 = sinon.fake.returns(2); // New fake, different behavior
// fake1 still returns 1, fake2 returns 2
```

### Creation vs Plugging In

**Spies (Combined):**

```javascript
// Spy creation and plugging in are combined
sinon.spy(obj, "method");
```

**Fakes (Separated):**

```javascript
// Creation and plugging in are separate
const fake = sinon.fake();
sinon.replace(obj, "method", fake);
```

This separation makes the responsibilities clearer and more testable.

## Migration Checklist

- [ ] Replace `sinon.spy()` with `sinon.fake()`
- [ ] Replace `sinon.spy(func)` with `sinon.fake(func)`
- [ ] Replace `sinon.spy(obj, "method")` with `sinon.replace(obj, "method", sinon.fake(obj.method))`
- [ ] Replace stub creation with fake factories (`fake.returns()`, `fake.throws()`, etc.)
- [ ] Update test assertions (same spy API works on fakes)
- [ ] Verify all tests still pass

## When to Keep Spies

You might want to keep using spies if:

1. **Legacy codebase** - Large existing test suite using spies
2. **Team familiarity** - Team is more comfortable with spy API
3. **Property accessors** - Using `sinon.spy(obj, "prop", ["get", "set"])` (no direct fake equivalent)

For new code, prefer fakes.

## See Also

- [Fakes Documentation](/concepts/fakes/)
- [Spy API Documentation](./api/)
- [Why Fakes Over Spies](/concepts/fakes/#prefer-fakes-over-spies-and-stubs)
