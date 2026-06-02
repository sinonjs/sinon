---
url: /concepts/fakes/api/resolves.md
description: Creates a fake that returns a resolved `Promise` for the passed value.
---

# `fake.resolves(value)`

Creates a fake that returns a resolved `Promise` for the passed value.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("fake.resolves", async (t) => {
  const fake = sinon.fake.resolves("Apple pie");

  const value = await fake();

  t.equal(value, "Apple pie", "fake resolves with provided value");

  t.end();
});

```
