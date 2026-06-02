---
url: /concepts/matchers.md
description: >-
  Flexible argument matching for assertions. Make tests more expressive with
  fuzzy or specific value matching.
---

# Matchers

## Introduction

Matchers can be passed as arguments to [`spy.calledOn`][spy-called-on], [`spy.calledWith`][spy-called-with], [`spy.returned`][spy-returned] and the
corresponding [`sinon.assert`][assert] functions as well as [`spy.withArgs`][spy-with-args]. Matchers allow to be either more fuzzy or more specific about the expected value.

```js
import t from "tap";
import sinon from "sinon";

t.test(`matcher allows fuzzy comparisons`, (t) => {
  const book = {
    pages: 42,
    author: "cjno",
    id: {
      isbn10: "0596517742",
      isbn13: "978-0596517748"
    }
  };
  const f = sinon.fake();

  f(book);

  t.ok(f.calledWith(sinon.match({ author: "cjno" })));
  t.ok(f.calledWith(sinon.match.has("pages", 42)));
  t.ok(
    f.calledWith(
      sinon.match.has("id", sinon.match.has("isbn13", "978-0596517748"))
    )
  );

  t.end();
});

```

```js
import t from "tap";
import sinon from "sinon";

t.test(`matcher allows specific comparisons`, (t) => {
  const f = sinon.fake();

  f("apple pie");

  t.ok(f.calledWith(sinon.match(sinon.match.string)));
  t.notOk(f.calledWith(sinon.match(sinon.match.number)));

  t.end();
});

```

[assert]: /concepts/assertions/

[spy-called-on]: /concepts/spies/api/called-on

[spy-called-with]: /concepts/spies/api/called-with

[spy-returned]: /concepts/spies/api/returned

[spy-with-args]: /concepts/spies/api/with-args
