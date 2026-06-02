---
title: Migrating to Fakes
description: Guide for migrating from stubs to fakes. Learn why fakes are preferred and see code examples for common migration patterns.
weight: 30
---

# Migrating from Stubs to Fakes

[Fakes][fakes] are the modern, preferred alternative to stubs for most use cases. They provide simpler, immutable behavior while maintaining the same spy API. This guide shows how to migrate your code from stubs to fakes.

## Why Migrate to Fakes?

1. **Immutable** - Fakes can't change behavior after creation, preventing bugs
2. **Simpler** - No need to chain multiple behavior methods
3. **Same spy API** - All spy assertions work on fakes
4. **Clearer intent** - Behavior is defined at creation time

## When to Keep Using Stubs

Stubs have unique features that fakes don't provide:

1. **Call-specific behavior** - `onCall()`, `onFirstCall()`, `onSecondCall()`, `onThirdCall()`
2. **Argument-based behavior** - `withArgs()` for different returns per arguments
3. **Property stubbing** - `.get()`, `.set()`, `.value()` for property accessors
4. **Mutable behavior** - When you need to change behavior mid-test (usually a code smell)

For these cases, continue using stubs. For everything else, prefer fakes.

## Migration Patterns

### Simple Return Values

**Before (Stub):**

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

**Change:** Replace `sinon.stub().returns()` with `sinon.fake.returns()`

---

### Returning Arguments

**Before (Stub):**

```javascript
const stub = sinon.stub().returnsArg(0);
stub("hello"); // returns 'hello'
stub("world"); // returns 'world'
```

**After (Fake):**

```javascript
// Fakes don't have returnsArg, use callsFake
const fake = sinon.fake((arg) => arg);
fake("hello"); // returns 'hello'
fake("world"); // returns 'world'
```

**Change:** Use `sinon.fake(func)` with a function that returns the argument

---

### Throwing Errors

**Before (Stub):**

```javascript
const stub = sinon.stub().throws(new Error("Failed"));
assert.throws(() => stub());
```

**After (Fake):**

```javascript
const fake = sinon.fake.throws(new Error("Failed"));
assert.throws(() => fake());
```

**Change:** Replace `sinon.stub().throws()` with `sinon.fake.throws()`

---

### Promise Resolution

**Before (Stub):**

```javascript
const stub = sinon.stub().resolves("success");
const result = await stub();
assert.equal(result, "success");
```

**After (Fake):**

```javascript
const fake = sinon.fake.resolves("success");
const result = await fake();
assert.equal(result, "success");
```

**Change:** Replace `sinon.stub().resolves()` with `sinon.fake.resolves()`

---

### Promise Rejection

**Before (Stub):**

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

**Change:** Replace `sinon.stub().rejects()` with `sinon.fake.rejects()`

---

### Custom Function Logic

**Before (Stub):**

```javascript
const stub = sinon.stub().callsFake(function (x) {
  return x * 2;
});
```

**After (Fake):**

```javascript
const fake = sinon.fake(function (x) {
  return x * 2;
});
```

**Change:** Pass function directly to `sinon.fake()` instead of chaining `.callsFake()`

---

### Callback Invocation (Sync)

**Before (Stub):**

```javascript
const stub = sinon.stub().yields("error", "data");
stub((err, data) => {
  assert.equal(err, "error");
  assert.equal(data, "data");
});
```

**After (Fake):**

```javascript
const fake = sinon.fake.yields("error", "data");
fake((err, data) => {
  assert.equal(err, "error");
  assert.equal(data, "data");
});
```

**Change:** Replace `sinon.stub().yields()` with `sinon.fake.yields()`

---

### Callback Invocation (Async)

**Before (Stub):**

```javascript
const stub = sinon.stub().yieldsAsync("error", "data");
// callback invoked asynchronously
```

**After (Fake):**

```javascript
const fake = sinon.fake.yieldsAsync("error", "data");
// callback invoked asynchronously
```

**Change:** Replace `sinon.stub().yieldsAsync()` with `sinon.fake.yieldsAsync()`

---

### Replacing Object Methods

**Before (Stub):**

```javascript
const obj = {
  method() {
    return "original";
  }
};
sinon.stub(obj, "method").returns("stubbed");
obj.method(); // 'stubbed'
```

**After (Fake):**

```javascript
const obj = {
  method() {
    return "original";
  }
};
const fake = sinon.fake.returns("stubbed");
sinon.replace(obj, "method", fake);
obj.method(); // 'stubbed'
```

**Change:** Create fake separately, then use `sinon.replace()` to plug it in

---

## Patterns That Require Stubs

### Call-Specific Behavior (Keep Stubs)

Some scenarios require call-specific behavior which fakes don't support:

```javascript
// This pattern requires stubs
const stub = sinon
  .stub()
  .onFirstCall()
  .returns(1)
  .onSecondCall()
  .returns(2)
  .returns(3);

stub(); // 1
stub(); // 2
stub(); // 3
stub(); // 3
```

**No fake equivalent** - Continue using stubs for this pattern.

**Alternative:** If you control the calls, create separate fakes:

```javascript
const fake1 = sinon.fake.returns(1);
const fake2 = sinon.fake.returns(2);
const fake3 = sinon.fake.returns(3);

// Use appropriate fake at each call site
```

---

### Argument-Based Behavior (Keep Stubs)

Returning different values based on arguments requires stubs:

```javascript
// This pattern requires stubs
const stub = sinon.stub();
stub.withArgs("apple").returns("fruit");
stub.withArgs("carrot").returns("vegetable");
stub.returns("unknown");

stub("apple"); // 'fruit'
stub("carrot"); // 'vegetable'
stub("pizza"); // 'unknown'
```

**No fake equivalent** - Continue using stubs for this pattern.

**Alternative:** Use a fake with conditional logic:

```javascript
const fake = sinon.fake((food) => {
  if (food === "apple") return "fruit";
  if (food === "carrot") return "vegetable";
  return "unknown";
});
```

---

### Property Stubbing (Keep Stubs)

Stubbing property getters/setters requires stubs:

```javascript
// This pattern requires stubs
const obj = {
  get name() {
    return "Alice";
  }
};

sinon.stub(obj, "name").get(() => "Bob");
obj.name; // 'Bob'
```

**No fake equivalent** - Continue using stubs for property stubbing.

---

## Key Differences

### Immutability

**Stubs (Mutable):**

```javascript
const stub = sinon.stub();
stub.returns(1); // Changes behavior
stub(); // 1
stub.returns(2); // Changes behavior again
stub(); // 2
```

**Fakes (Immutable):**

```javascript
const fake1 = sinon.fake.returns(1);
const fake2 = sinon.fake.returns(2);
fake1(); // 1
fake2(); // 2
// fake1 still returns 1, fake2 returns 2
```

### Behavior Chaining

**Stubs (Chained):**

```javascript
const stub = sinon.stub().onFirstCall().returns(1).onSecondCall().returns(2);
```

**Fakes (No Chaining):**

```javascript
// Behavior defined at creation
const fake = sinon.fake.returns(1);
// No way to change behavior
```

### Creation vs Plugging In

**Stubs (Combined):**

```javascript
// Stub creation and plugging in are combined
sinon.stub(obj, "method").returns(42);
```

**Fakes (Separated):**

```javascript
// Creation and plugging in are separate
const fake = sinon.fake.returns(42);
sinon.replace(obj, "method", fake);
```

## Migration Checklist

- [ ] Identify all `sinon.stub()` usage
- [ ] Check for call-specific behavior (`onCall`, `onFirstCall`, etc.) - keep as stub
- [ ] Check for argument-based behavior (`withArgs`) - keep as stub
- [ ] Check for property stubbing (`.get()`, `.set()`, `.value()`) - keep as stub
- [ ] Replace simple stubs with appropriate fake factories:
  - [ ] `stub().returns()` → `fake.returns()`
  - [ ] `stub().throws()` → `fake.throws()`
  - [ ] `stub().resolves()` → `fake.resolves()`
  - [ ] `stub().rejects()` → `fake.rejects()`
  - [ ] `stub().yields()` → `fake.yields()`
  - [ ] `stub().yieldsAsync()` → `fake.yieldsAsync()`
  - [ ] `stub().callsFake()` → `fake(func)`
- [ ] Update object method stubbing to use `sinon.replace()`
- [ ] Verify all tests still pass

## Decision Tree

```
Do you need call-specific behavior (onCall, onFirstCall)?
├─ Yes → Keep using stub
└─ No → Do you need argument-based behavior (withArgs)?
    ├─ Yes → Keep using stub
    └─ No → Do you need property stubbing (.get, .set, .value)?
        ├─ Yes → Keep using stub
        └─ No → Migrate to fake! ✨
```

## See Also

- [Fakes Documentation][fakes]
- [Stub API Documentation](./api/)
- [Why Fakes Over Stubs](/concepts/fakes/#prefer-fakes-over-spies-and-stubs)
- [Spy to Fake Migration](/concepts/spies/migrating-to-fakes)

[fakes]: /concepts/fakes/
