---
title: Migrating from Mocks
description: Guide for migrating from mocks to fakes with explicit assertions. Learn why separating concerns leads to better tests.
weight: 30
---

# Migrating from Mocks to Fakes

Mocks combine three concerns: behavior replacement, call observation, and assertions. Modern testing prefers separation of concerns using [fakes](/concepts/fakes/) with explicit assertions. This guide shows how to migrate from mocks to simpler alternatives.

## Why Migrate?

**Mocks are powerful but have drawbacks:**

1. **Brittle tests** - Tests break when implementation changes
2. **Coupled to internals** - Tests know too much about how code works
3. **Complex failures** - Mock errors can be cryptic
4. **Upfront expectations** - Requires predicting all interactions

**Fakes with explicit assertions are better:**

1. **Flexible tests** - Tests focus on behavior, not implementation
2. **Clear intent** - Assertions show what matters
3. **Better errors** - Assertion failures are direct
4. **After-the-fact verification** - Test what actually happened

## When to Keep Using Mocks

Keep mocks when:

1. **Upfront expectations clarify intent** - The expectation itself documents behavior
2. **Immediate feedback wanted** - Fail fast on first unexpected call
3. **Complex interaction patterns** - Multiple related expectations on one object

For most cases, use fakes.

## Migration Patterns

### Basic Expectation → Fake + Assertion

**Before (Mock):**

```javascript
const obj = {
  method() {
    return "original";
  }
};
const mock = sinon.mock(obj);

mock.expects("method").once();
obj.method();
mock.verify();
```

**After (Fake):**

```javascript
const obj = {
  method() {
    return "original";
  }
};
const fake = sinon.fake.returns("result");

sinon.replace(obj, "method", fake);
obj.method();

assert.ok(fake.calledOnce);
```

**Benefits:**

- Clearer: Shows what we're checking (calledOnce)
- More flexible: Can add more assertions
- Better errors: "expected true to be true" vs mock expectation message

---

### Argument Expectations → Fake + Argument Assertion

**Before (Mock):**

```javascript
mock.expects("greet").withArgs("Alice");
obj.greet("Alice");
mock.verify();
```

**After (Fake):**

```javascript
const fake = sinon.fake();
sinon.replace(obj, "greet", fake);

obj.greet("Alice");

assert.ok(fake.calledWith("Alice"));
```

**Benefits:**

- Can check multiple argument patterns
- Can assert on partial matches
- Better error messages

---

### Multiple Calls → Fake + Call Count

**Before (Mock):**

```javascript
mock.expects("log").atLeast(2).atMost(5);
// ... actions ...
mock.verify();
```

**After (Fake):**

```javascript
const fake = sinon.fake();
sinon.replace(logger, "log", fake);

// ... actions ...

assert.ok(fake.callCount >= 2, "called at least twice");
assert.ok(fake.callCount <= 5, "called at most 5 times");
```

**Benefits:**

- More flexible assertion logic
- Can check exact count or ranges
- Can inspect actual call count

---

### Return Value Control → Fake Factory

**Before (Mock - using stub behavior):**

```javascript
mock.expects("getData").once().returns({ id: 1, name: "Alice" });

const result = obj.getData();
mock.verify();
```

**After (Fake):**

```javascript
const fake = sinon.fake.returns({ id: 1, name: "Alice" });
sinon.replace(obj, "getData", fake);

const result = obj.getData();

assert.deepEqual(result, { id: 1, name: "Alice" });
assert.ok(fake.calledOnce);
```

**Benefits:**

- Behavior and verification separated
- Can verify behavior independently
- Clearer test structure

---

### Sequential Behavior → Multiple Fakes or Stub

**Before (Mock with stub behavior):**

```javascript
mock
  .expects("fetch")
  .onFirstCall()
  .returns("first")
  .onSecondCall()
  .returns("second");

obj.fetch(); // 'first'
obj.fetch(); // 'second'
mock.verify();
```

**After Option 1 (Keep using stub for this case):**

```javascript
const stub = sinon
  .stub(obj, "fetch")
  .onFirstCall()
  .returns("first")
  .onSecondCall()
  .returns("second");

obj.fetch(); // 'first'
obj.fetch(); // 'second'

assert.ok(stub.calledTwice);
```

**After Option 2 (Fake with custom logic):**

```javascript
const calls = ["first", "second"];
let callIndex = 0;
const fake = sinon.fake(() => calls[callIndex++]);
sinon.replace(obj, "fetch", fake);

obj.fetch(); // 'first'
obj.fetch(); // 'second'

assert.equal(fake.callCount, 2);
```

**Note:** For sequential behavior, stubs are often the best choice.

---

### Context Expectations → Fake + This Check

**Before (Mock):**

```javascript
const obj1 = { name: "obj1" };
const obj2 = { name: "obj2", method() {} };

const mock = sinon.mock(obj2);
mock.expects("method").on(obj1);

obj2.method.call(obj1);
mock.verify();
```

**After (Fake):**

```javascript
const obj1 = { name: "obj1" };
const obj2 = { name: "obj2", method() {} };

const fake = sinon.fake();
sinon.replace(obj2, "method", fake);

obj2.method.call(obj1);

assert.equal(fake.thisValues[0], obj1);
```

**Benefits:**

- Access to all `this` values
- Can check multiple calls
- More flexible assertions

---

### Never Called → Fake + Not Called

**Before (Mock):**

```javascript
mock.expects("dangerousMethod").never();
// ... actions ...
mock.verify();
```

**After (Fake):**

```javascript
const fake = sinon.fake();
sinon.replace(obj, "dangerousMethod", fake);

// ... actions ...

assert.ok(fake.notCalled, "dangerous method should not be called");
```

**Benefits:**

- Clearer assertion
- Better error message
- Can be part of larger test

---

### Multiple Expectations → Multiple Assertions

**Before (Mock):**

```javascript
const mock = sinon.mock(service);
mock.expects("load").once();
mock.expects("process").once();
mock.expects("save").once();

// ... actions ...
mock.verify();
```

**After (Fake):**

```javascript
const loadFake = sinon.fake.returns("data");
const processFake = sinon.fake.returns("processed");
const saveFake = sinon.fake.resolves();

sinon.replace(service, "load", loadFake);
sinon.replace(service, "process", processFake);
sinon.replace(service, "save", saveFake);

// ... actions ...

assert.ok(loadFake.calledOnce, "load called once");
assert.ok(processFake.calledOnce, "process called once");
assert.ok(saveFake.calledOnce, "save called once");
```

**Benefits:**

- Each assertion is independent
- Failures are more specific
- Can verify order if needed: `sinon.assert.callOrder(loadFake, processFake, saveFake)`

---

## Anti-Pattern: Testing Implementation

Mocks make it easy to test implementation details. Avoid this:

**Bad (Mock on implementation):**

```javascript
// Testing HOW the code works
const mock = sinon.mock(database);
mock.expects("query").withArgs("SELECT * FROM users");
mock.expects("query").withArgs("SELECT * FROM posts");

controller.getUserWithPosts(userId);
mock.verify();
```

**Good (Fake on behavior):**

```javascript
// Testing WHAT the code does
const fake = sinon.fake.resolves({ user: userData, posts: postsData });
sinon.replace(database, "getUserWithPosts", fake);

const result = await controller.getUserWithPosts(userId);

assert.deepEqual(result.user, expectedUser);
assert.deepEqual(result.posts, expectedPosts);
assert.ok(fake.calledWith(userId));
```

**Why this is better:**

- Test survives database query changes
- Focuses on behavior, not implementation
- Easier to understand what's being tested

---

## Refactoring Strategy

### Step 1: Identify Mock Usage

Find all `sinon.mock()` usage in your codebase:

```bash
grep -r "sinon.mock" test/
```

### Step 2: Categorize by Complexity

**Simple mocks** (one expectation, no fancy behavior):

- Migrate immediately to fakes

**Medium mocks** (multiple expectations, simple behavior):

- Consider if all expectations are necessary
- Migrate useful ones to fakes + assertions

**Complex mocks** (many expectations, complex behavior):

- Keep as mocks if they clarify intent
- Or break into smaller, focused tests

### Step 3: Migrate One at a Time

For each mock:

1. **Understand the expectation** - What's being verified?
2. **Replace with fake** - Use appropriate fake factory
3. **Add assertions** - Explicitly check what matters
4. **Run tests** - Ensure behavior unchanged
5. **Commit** - Small, focused commits

### Step 4: Simplify

After migration:

- Remove unnecessary verifications
- Combine related assertions
- Focus tests on behavior

## Decision Tree

```
Is the expectation about behavior or implementation?
├─ Behavior → Use fake + explicit assertion
└─ Implementation → Do you really need to test this?
    ├─ Yes, it's critical → Keep mock (rare)
    └─ No, it's an implementation detail → Refactor test to check behavior
```

## Migration Checklist

- [ ] Find all `sinon.mock()` usage
- [ ] For each mock:
  - [ ] Identify what's being verified
  - [ ] Determine if verification is necessary
  - [ ] Replace mock with fake
  - [ ] Add explicit assertions
  - [ ] Remove unnecessary expectations
  - [ ] Update test to focus on behavior
- [ ] Run all tests
- [ ] Review test clarity and maintainability

## Benefits After Migration

1. **More maintainable** - Tests survive refactoring
2. **Clearer intent** - Assertions show what matters
3. **Better errors** - Know exactly what failed
4. **More flexible** - Can verify in different ways
5. **Less brittle** - Implementation changes don't break tests

## See Also

- [Fakes Documentation](/concepts/fakes/)
- [Mock API Documentation](/concepts/mocks/)
- [When NOT to use mocks](./#when-to-not-use-mocks)
- [Error Handling](./error-handling)
- [Martin Fowler: Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html)
