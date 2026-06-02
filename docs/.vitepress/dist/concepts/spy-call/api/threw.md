---
url: /concepts/spy-call/api/threw.md
description: 'Returns `true`, when the spied function threw on this call.'
---

# `spyCall.threw();`

Returns `true`, when the spied function threw on this call.

```js
import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.threw returns true,
    when spied function threw on this call`,
  (t) => {
    const f = sinon.fake.throws("The pie is a lie");
    let sc;

    try {
      f();
    } catch (ex) {
      sc = f.firstCall;
    }

    t.ok(sc.threw());

    t.end();
  }
);

```

## `spyCall.threw("TypeError");`

Returns `true`, when the spied function threw provided type on this call.

```js
import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.threw returns true,
    when spied function threw provided error type on this call`,
  (t) => {
    const f = sinon.fake.throws(new TypeError("The pie is a lie"));
    let sc;

    try {
      f();
    } catch (ex) {
      sc = f.firstCall;
    }

    t.ok(sc.threw("TypeError"));

    t.end();
  }
);

```

## `spyCall.threw(obj);`

Returns `true`, when the spied function threw provided object on this call.

```js
import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.threw returns true,
    when spied function threw provided object on this call`,
  (t) => {
    const error = new TypeError("The pie is a lie");
    const f = sinon.fake.throws(error);
    let sc;

    try {
      f();
    } catch (ex) {
      sc = f.firstCall;
    }

    t.ok(sc.threw(error));

    t.end();
  }
);

```
