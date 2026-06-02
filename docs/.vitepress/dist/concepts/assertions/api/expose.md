---
url: /concepts/assertions/api/expose.md
description: >-
  Exposes assertions into another object, to allow for integration with a test
  framework.
---

# `assert.expose(target, options);`

Exposes assertions into another object, to allow for integration with a test framework.

For example, [sinon-chai][0] exposes Sinon's assertions on its own object.

```js
import t from "tap";
import sinon from "sinon";

t.test("assert.expose integrates assertions into another object", (t) => {
  // Create a target object to expose assertions onto
  const myAssert = {};

  // Expose sinon assertions with blank prefix
  sinon.assert.expose(myAssert, { prefix: "" });

  // Verify assertions are exposed without prefix
  t.ok(myAssert.called, "should have 'called' assertion");
  t.ok(myAssert.calledOnce, "should have 'calledOnce' assertion");
  t.ok(myAssert.calledWith, "should have 'calledWith' assertion");

  // Verify the exposed assertions work
  const fake = sinon.fake();
  fake("arg");

  t.doesNotThrow(() => myAssert.called(fake), "exposed assertion should work");

  t.end();
});

```

This will give you `spy.should.have.been.called` and so on.

See [sinon-chai documentation][0] for usage examples.

The method accepts an optional options object with two options:

[0]: https://github.com/chaijs/sinon-chai?tab=readme-ov-file#assertions
