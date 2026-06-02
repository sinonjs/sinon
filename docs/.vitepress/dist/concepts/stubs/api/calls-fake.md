---
url: /concepts/stubs/api/calls-fake.md
description: Makes the stub call the provided `fakeFunction` when invoked.
---

# `stub.callsFake(f)`

Makes the stub call the provided `fakeFunction` when invoked.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.callsFake", (t) => {
  const myObj = {};
  myObj.prop = function propFn() {
    return "foo";
  };

  function f() {
    return "bar";
  }

  sinon.stub(myObj, "prop").callsFake(f);

  t.equal(myObj.prop(), "bar", "stub calls the fake function");

  sinon.restore();
  t.end();
});

```
