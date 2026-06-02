---
url: /concepts/matchers/api/has.md
description: Requires the value to define the given `property`.
---

# `sinon.match.has(property[, expectation])`

Requires the value to define the given `property`.

The property might be inherited via the prototype chain. If the optional expectation is given, the value of the property is deeply compared with the expectation. The expectation can be another matcher.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.has", (t) => {
  const fake = sinon.fake();

  fake({ name: "Alice" });
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.has("name"));
  }, "should accept object with property");

  fake({ name: "Alice", age: 30 });
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.has("name", "Alice"));
  }, "should accept matching property value");

  const obj = Object.create({ inherited: true });
  fake(obj);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.has("inherited"));
  }, "should accept inherited property");

  fake.resetHistory();
  fake({ name: "Alice" });
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.has("age")),
    /expected fake to be called with match/,
    "should reject missing property"
  );

  fake.resetHistory();
  fake({ name: "Alice" });
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.has("name", "Bob")),
    /expected fake to be called with match/,
    "should reject wrong property value"
  );

  t.end();
});

```
