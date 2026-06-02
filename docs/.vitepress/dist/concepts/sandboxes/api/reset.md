---
url: /concepts/sandboxes/api/reset.md
description: >-
  Resets the mutable behavior in [`stubs`](/concepts/stubs/) as well as the
  history of all [`fakes`](/concepts/fakes/), [`spies`](/concepts/spies/) and
  [`stubs`](/concepts/stubs/) created using the sandbox.
---

# `sandbox.reset();`

Resets the mutable behavior in [`stubs`](/concepts/stubs/) as well as the history of all [`fakes`](/concepts/fakes/), [`spies`](/concepts/spies/) and [`stubs`](/concepts/stubs/) created using the sandbox.

In terms of resetting history, this is equivalent to calling [`sandbox.resetHistory`](./reset-history).

## Example: resetting mutable behavior of stubs

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("sandbox.reset - resetting mutable behavior of stubs", (t) => {
  // The sinon root object is a default sandbox
  const stub = sinon.stub();

  // Observe the default behavior
  t.equal(typeof stub(), "undefined", "stub returns undefined by default");

  // Set some behavior for this stub
  stub.returns("Apple pie");

  // Try it out
  t.equal(stub(), "Apple pie", "stub returns Apple pie");

  // Reset behavior and history of everything created using the default
  // sandbox `sinon`
  sinon.reset();

  // Observe the default behavior
  t.equal(typeof stub(), "undefined", "stub returns undefined after reset");

  t.end();
});

```

## Example: `sinon.reset` does not change immutable behavior in fakes

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("sandbox.reset - does not change immutable behavior in fakes", (t) => {
  // The sinon root object is a default sandbox
  const fake = sinon.fake.returns("Strawberry pie");

  // Observe the set (immutable) behavior
  t.equal(fake(), "Strawberry pie", "fake returns Strawberry pie");

  sinon.reset();

  // Observe the set (immutable) behavior still exists
  t.equal(
    fake(),
    "Strawberry pie",
    "fake still returns Strawberry pie after reset"
  );

  t.end();
});

```
