---
url: /concepts/fakes/api/rejects.md
description: Creates a fake that returns a rejected `Promise` for the passed value.
---

# `fake.rejects(value)`

Creates a fake that returns a rejected `Promise` for the passed value.

If an `Error` is passed as the `value` argument, then that will be the value of the promise. If any other value is passed, then that will be used for the `message` property of the `Error` returned by the promise.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("fake.rejects", async (t) => {
  const fake1 = sinon.fake.rejects("not apple pie");
  const fake2 = sinon.fake.rejects(new Error("not peach pie"));

  try {
    await fake1();
    t.fail("fake1 should have rejected");
  } catch (error) {
    t.equal(
      error.message,
      "not apple pie",
      "fake1 rejects with string message"
    );
  }

  try {
    await fake2();
    t.fail("fake2 should have rejected");
  } catch (error) {
    t.equal(error.message, "not peach pie", "fake2 rejects with Error object");
  }

  t.end();
});

```
