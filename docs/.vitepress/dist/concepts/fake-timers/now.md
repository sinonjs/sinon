---
url: /concepts/fake-timers/now.md
description: Returns the current fake time in milliseconds.
---

# `clock.now`

Returns the current fake time in milliseconds.

```js
import t from "tap";
import sinon from "sinon";

t.test("clock.now returns the current fake time", (t) => {
  const clock = sinon.useFakeTimers({ now: 1000 });

  t.equal(clock.now, 1000, "clock.now should be initial timestamp");

  clock.tick(500);

  t.equal(clock.now, 1500, "clock.now should advance after tick");

  clock.restore();
  t.end();
});

t.test("clock.now with Date object initialization", (t) => {
  const startDate = new Date("2020-01-01T00:00:00Z");
  const clock = sinon.useFakeTimers(startDate);

  t.equal(
    clock.now,
    startDate.getTime(),
    "clock.now should match Date.getTime()"
  );

  clock.restore();
  t.end();
});

```
