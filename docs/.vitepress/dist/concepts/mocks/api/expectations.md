---
url: /concepts/mocks/api/expectations.md
description: >-
  All the expectation methods return an expectation instance, meaning you can
  chain them.
---

# Expectations

All the expectation methods return an expectation instance, meaning you can chain them.

Typical usage:

```js
import t from "tap";
import sinon from "sinon";

t.test("mock expectations can chain atLeast and atMost", (t) => {
  // Create an object with a real method
  const obj = {
    ajax: function () {
      return "response";
    }
  };

  // Set up expectations
  const mock = sinon.mock(obj);
  mock.expects("ajax").atLeast(2).atMost(5);

  // Call the method within the expected range (3 times)
  obj.ajax();
  obj.ajax();
  obj.ajax();

  // Verify expectations are met
  t.doesNotThrow(() => {
    mock.verify();
  }, "should not throw when expectations are met");

  // Restore
  mock.restore();

  t.end();
});

```

## `var expectation = sinon.expectation.create([methodName]);`

Creates an expectation without a mock object, which is essentially an anonymous mock function.

Method name is optional and is used in exception messages to make them more readable.

## `var expectation = sinon.mock([methodName]);`

The same as the above.

## `expectation.atLeast(number);`

Specify the minimum amount of calls expected.

## `expectation.atMost(number);`

Specify the maximum amount of calls expected.

## `expectation.never();`

Expect the method to never be called.

## `expectation.once();`

Expect the method to be called exactly once.

## `expectation.twice();`

Expect the method to be called exactly twice.

## `expectation.thrice();`

Expect the method to be called exactly thrice.

## `expectation.exactly(number);`

Expect the method to be called exactly `number` times.

## `expectation.withArgs(arg1, arg2, ...);`

Expect the method to be called with the provided arguments and possibly others.

An `expectation` instance only holds onto a single set of arguments specified with `withArgs`. Subsequent calls will overwrite the previously-specified set of arguments (even if they are different), so it is generally not intended that this method be invoked more than once per test case.

## `expectation.withExactArgs(arg1, arg2, ...);`

Expect the method to be called with the provided arguments and no others.

An `expectation` instance only holds onto a single set of arguments specified with `withExactArgs`. Subsequent calls will overwrite the previously-specified set of arguments (even if they are different), so it is generally not intended that this method be invoked more than once per test case.

## `expectation.on(obj);`

Expect the method to be called with `obj` as `this`."}

## `expectation.verify();`

Verifies the expectation and throws an exception if it's not met.
