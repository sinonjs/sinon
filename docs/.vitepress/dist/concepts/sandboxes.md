---
url: /concepts/sandboxes.md
description: >-
  Manage multiple fakes, spies, and stubs with automatic cleanup. Simplifies
  test teardown by grouping related fakes.
---

# Sandboxes

## Introduction

Sandboxes remove the need to keep track of every fake created, which greatly simplifies cleanup.

## Default sandbox

The `sinon` object itself is a sandbox, known as the *default sandbox*.

It has all the methods and properties as the [sandbox API][sandbox-api].

## Using the default sandbox

This is the recommended way to use sandboxes.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("sandbox - using the default sandbox", (t) => {
  const myObject = {
    hello: "world"
  };

  // using the stub method on the default sandbox
  sinon.stub(myObject, "hello").value("Sinon");

  t.equal(myObject.hello, "Sinon", "property stubbed to Sinon");

  sinon.restore();
  t.equal(myObject.hello, "world", "property restored to world");

  t.end();
});

```

## Using a custom sandbox

Unless you have an advanced setup or need a divergent configuration, you probably want to only use the default sandbox.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("sandbox - using a custom sandbox", (t) => {
  const sandbox = sinon.createSandbox();
  const myObject = {
    hello: "world"
  };

  // using the stub method on the sandbox
  sandbox.stub(myObject, "hello").value("Banana");

  t.equal(myObject.hello, "Banana", "property stubbed to Banana");

  sandbox.restore();
  t.equal(myObject.hello, "world", "property restored to world");

  t.end();
});

```

[sandbox-api]: ./api/
