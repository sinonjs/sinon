---
url: /concepts/matchers/custom-matchers.md
description: >-
  Create custom matcher functions using sinon.match() to define flexible
  matching logic for your tests.
---

# Custom matchers

Custom matchers are created with the `sinon.match` factory.

The test function takes a value as the only argument. It must return `true`, when the value matches the expectation and `false` otherwise.

```js
import t from "tap";
import sinon from "sinon";

function test(value) {
  return Boolean(value);
}
const trueIsh = sinon.match(test);

t.test(`custom matcher`, (t) => {
  const f = sinon.fake();

  f("apple pie");

  t.ok(f.calledWith(trueIsh));

  t.end();
});

```
