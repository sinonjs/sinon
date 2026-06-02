---
url: /concepts/matchers/combining-matchers.md
description: >-
  Combine multiple matchers using and(), or(), and not() for complex argument
  matching logic.
---

# Combining matchers

All matchers implement `and` and `or`. This allows to logically combine multiple matchers. The result is a new matcher that requires both (`and`) or one of the matchers (`or`) to return `true`.

```js
import t from "tap";
import sinon from "sinon";

function Book(p) {
  this.pages = p;
}

t.test(`combining matchers`, (t) => {
  const stringOrNumber = sinon.match.string.or(sinon.match.number);
  const f = sinon.fake();
  f("apple pie");
  t.ok(f.calledWith(stringOrNumber));

  const bookWithPages = sinon.match
    .instanceOf(Book)
    .and(sinon.match.has("pages"));
  const b = new Book(42);
  const h = sinon.fake();
  h(b);
  t.ok(h.calledWith(bookWithPages));

  t.end();
});

```
