---
url: /concepts/assertions.md
description: >-
  Built-in assertions that mirror spy/stub behavior. Provides detailed error
  messages when assertions fail.
---

# Assertions

Sinon.JS ships with a set of assertions that mirror most behavior verification methods and properties on [fakes][fakes], [spies][spies] and [stubs][stubs].

The advantage of using the assertions is that failed expectations on [fakes][fakes], [spies][spies] and [stubs][stubs] can be expressed directly as assertion failures with detailed and helpful error messages.

## Examples

### Without `sinon.assert`

```js
import t from "tap";
import sinon from "sinon";

t.test("without sinon.assert, failures lack helpful context", (t) => {
  const f = sinon.fake();

  // Using generic assertion without sinon.assert provides less helpful errors
  // This would fail with a generic "expected false to be true" message
  t.notOk(f.calledOnce, "fake should not be called yet");

  // Call the fake
  f();

  // Now it should be true
  t.ok(f.calledOnce, "fake should be called once");

  t.end();
});

```

### With `sinon.assert`

```js
import t from "tap";
import sinon from "sinon";

t.test("with sinon.assert, failures provide detailed error messages", (t) => {
  const msg = "Apple Pie";
  const f = sinon.fake();

  // Verify that sinon.assert throws when expectation is not met
  t.throws(
    () => sinon.assert.calledOnce(f),
    /expected fake to be called once but was called 0 times/i,
    "should throw with detailed message when fake not called"
  );

  // Call the fake
  f(msg);

  // No error should be thrown when assertions pass
  t.doesNotThrow(
    () => sinon.assert.calledOnce(f),
    "should not throw when fake called once"
  );

  t.doesNotThrow(
    () => sinon.assert.calledWith(f, msg),
    "should not throw when fake called with correct argument"
  );

  t.end();
});

```

## Integrations

* [jest-sinon](https://www.npmjs.com/package/jest-sinon)
* [referee-sinon](https://github.com/sinonjs/referee-sinon?tab=readme-ov-file#referee-sinon) - from the makers of Sinon 🙂
* [sinon-chai](https://github.com/chaijs/sinon-chai#readme)

To make sure assertions integrate nicely with your assertion framework, you should customize [`sinon.assert.fail`][fail] and look into [`sinon.assert.expose`][expose] and [`sinon.assert.pass`][pass].

[expose]: ./api/expose

[fail]: ./api/fail

[pass]: ./api/pass

[fakes]: /concepts/fakes/

[spies]: /concepts/spies/

[stubs]: /concepts/stubs/
