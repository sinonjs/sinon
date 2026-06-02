---
url: /concepts/spies/api/printf.md
description: '`spy.printf("format string", [arg1, arg2, ...]);`'
---

# `spy.printf`

`spy.printf("format string", [arg1, arg2, ...]);`

Returns the passed format string with the following replacements performed:

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.printf", (t) => {
  const s = sinon.spy(function hello() {
    return "world";
  });

  s();
  s();

  t.equal(s.printf("%n"), "hello", "formats spy name with %n");

  t.equal(
    s.printf("The spy %n has been called %c"),
    "The spy hello has been called twice",
    "formats spy name and call count"
  );

  t.end();
});

```
