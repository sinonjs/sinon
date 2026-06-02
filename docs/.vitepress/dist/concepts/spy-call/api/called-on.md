---
url: /concepts/spy-call/api/called-on.md
description: Returns `true` when `obj` was context (`this`) for the call.
---

# `spyCall.calledOn(obj);`

Returns `true` when `obj` was context (`this`) for the call.

```js
import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.calledOn returns true,
    when argument is context`,
  (t) => {
    const f = sinon.fake();
    const context = {};

    f.apply(context);

    const firstCall = f.firstCall;

    t.ok(firstCall.calledOn(context));

    t.end();
  }
);

```

## Using a matcher

`calledOn` also accepts a matcher `spyCall.calledOn(sinon.match(fn))` (see [matchers](/concepts/matchers/)).

```js
import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.calledOn returns true,
    when argument is context`,
  (t) => {
    const f = sinon.fake();
    const context = {
      author: "cjno",
      hello: "world"
    };

    f.apply(context);

    const firstCall = f.firstCall;

    t.ok(firstCall.calledOn(sinon.match({ author: "cjno" })));

    t.end();
  }
);

```

## See also

* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
