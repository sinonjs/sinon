---
url: /concepts/fakes.md
description: >-
  Simple, immutable test doubles that replace spies and stubs. Records
  arguments, return values, and exceptions for all calls.
---

# Fakes

## Introduction

`sinon.fake` allows creation of a `fake` `Function` with the ability to set a default behavior.

In Sinon, a `fake` is a `Function` that records arguments, return value, the value of `this` and `Error` thrown (if any) for all of its calls.

A fake is an [immutable object][immutable]: once created, its behavior will not change.

### Basic usage

```js
import tap from "tap";
import sinon from "sinon";

tap.test("basic fake usage - creates a fake that returns a value", (t) => {
  // Create a fake that returns a value
  const fake = sinon.fake.returns(42);

  // Call it like any function
  const result = fake();
  t.equal(result, 42, "fake returns the configured value");

  // Fakes record all calls
  t.ok(fake.calledOnce, "fake.calledOnce is true");
  t.equal(
    fake.firstArg,
    undefined,
    "fake.firstArg is undefined when no arguments passed"
  );

  t.end();
});

```

## Prefer fakes over spies and stubs

Fakes are alternatives to the older [spies][spies] and [stubs][stubs], and can replace them in all use cases.

They are designed to be simpler and easier to use, while avoiding confusion by being [immutable][immutable].

All `fakes` [have the same API][spy-api] as [`spies`][spies]. This includes access to call information through the [spy call API][spy-call-api], such as `firstArg`, `lastArg`, and `callback` properties.

## Using fakes instead of spies

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("Using fakes instead of spies", (t) => {
  const foo = {
    bar: () => "baz"
  };

  // wrap existing method without changing its behavior
  const fake = sinon.replace(foo, "bar", sinon.fake(foo.bar));

  // behavior is the same
  t.equal(fake(), "baz", "fake returns original behavior");

  // records information about calls
  t.equal(fake.callCount, 1, "callCount is tracked");

  sinon.restore();
  t.end();
});

```

## Using fakes instead of stubs

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("Using fakes instead of stubs", (t) => {
  const foo = {
    bar: () => "baz"
  };

  // replace method with a fake one
  const fake = sinon.replace(foo, "bar", sinon.fake.returns("fake value"));

  // returns fake value
  t.equal(foo.bar(), "fake value", "fake returns fake value");

  // records information about calls
  t.equal(fake.callCount, 1, "callCount is tracked");

  sinon.restore();
  t.end();
});

```

[spies]: /concepts/spies/

[spy-api]: /concepts/spies/api/

[spy-call-api]: /concepts/spy-call/api/

[stubs]: /concepts/stubs/

[replace]: /concepts/sandboxes/api/replace

[immutable]: https://en.wikipedia.org/wiki/Immutable_object
