---
url: /concepts/matchers/api/has-nested.md
description: >-
  Requires the value to define the given `propertyPath`. Dot (`prop.prop`) and
  bracket (`prop[0]`) notations are supported as in
  [Lodash.get](https://lodash.com/docs/4.4.2#get).
---

# `sinon.match.hasNested(propertyPath[, expectation])`

Requires the value to define the given `propertyPath`. Dot (`prop.prop`) and bracket (`prop[0]`) notations are supported as in [Lodash.get](https://lodash.com/docs/4.4.2#get).

The propertyPath might be inherited via the prototype chain. If the optional expectation is given, the value at the propertyPath is deeply compared with the expectation. The expectation can be another matcher.

```js
import t from "tap";
import sinon from "sinon";

t.test(
  "sinon.match.hasNested matches nested properties with array notation",
  (t) => {
    const matcher = sinon.match.hasNested("a[0].b.c");

    const actual = { a: [{ b: { c: 3 } }] };

    // Verify the matcher matches the nested structure
    t.ok(
      matcher.test(actual),
      "should match nested property with array notation"
    );

    // Verify it doesn't match when property is missing
    const noMatch = { a: [{ b: {} }] };
    t.notOk(
      matcher.test(noMatch),
      "should not match when nested property is missing"
    );

    t.end();
  }
);

```

```js
import t from "tap";
import sinon from "sinon";

t.test(
  "sinon.match.hasNested matches nested properties with dot notation",
  (t) => {
    const matcher = sinon.match.hasNested("a.b.c");

    const actual = { a: { b: { c: 3 } } };

    // Verify the matcher matches the nested structure
    t.ok(
      matcher.test(actual),
      "should match nested property with dot notation"
    );

    // Verify it doesn't match when property is missing
    const noMatch = { a: { b: {} } };
    t.notOk(
      matcher.test(noMatch),
      "should not match when nested property is missing"
    );

    t.end();
  }
);

```
