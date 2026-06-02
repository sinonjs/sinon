---
url: /concepts/fake-timers/use-fake-timers.md
description: >-
  Replaces global timers with fake implementations. Configurable with now,
  toFake, shouldAdvanceTime, and more.
---

# `sinon.useFakeTimers([config])`

Causes Sinon to replace the global `setTimeout`, `clearTimeout`, `setInterval`, `clearInterval`, `setImmediate`, `clearImmediate`, `process.hrtime`, `performance.now` (when available) and `Date` with a custom implementation which is bound to the returned `clock` object.

In Node.js, the `timers` and `timers/promises` modules will also receive fake timers when using the global scope.

## Without arguments

Starts the clock at the UNIX epoch (timestamp of `0`).

## With `now` argument

As above, but rather than starting the clock with a timestamp of 0, start at the provided timestamp `now`. You can also pass in a Date object, and its `getTime()` will be used for the starting timestamp.

```js
// Start at January 1st 2017
const clock = sinon.useFakeTimers(1483228800000);
```

## With config object

As above, but allows further configuration options.

```js
// Start at a specific time with a custom loop limit
const clock = sinon.useFakeTimers({
  now: 1483228800000,
  loopLimit: 10
});
```

### Configuration Options

| Option                           | Type        | Default             | Description                                                                                                                |
| -------------------------------- | ----------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `config.now`                     | Number/Date | 0                   | Installs fake timers with the specified unix epoch                                                                         |
| `config.toFake`                  | String\[]    | All except nextTick | An array with explicit function names to fake. Cannot be combined with `toNotFake`                                         |
| `config.toNotFake`               | String\[]    | \[]                  | An array with explicit function names that should remain native. Cannot be combined with `toFake`                          |
| `config.loopLimit`               | Number      | 1000                | The maximum number of timers that will be run when calling `runAll()`                                                      |
| `config.shouldAdvanceTime`       | Boolean     | false               | Tells fake timers to increment mocked time automatically based on real system time shift                                   |
| `config.advanceTimeDelta`        | Number      | 20                  | Relevant only when using `shouldAdvanceTime: true`. Increment mocked time by this many ms for every ms change in real time |
| `config.shouldClearNativeTimers` | Boolean     | false               | Tells fake timers to clear native (non-fake) timers before installing                                                      |
| `config.ignoreMissingTimers`     | Boolean     | false               | Tells fake timers to ignore missing timers that might not exist in the given environment                                   |
| `config.target`                  | Object      | global              | Use a specific object instead of the usual global object. Useful with JSDOM                                                |

### `config.toFake`

By default, fake timers will automatically fake all methods except `process.nextTick`. You can explicitly specify which methods to fake:

```js
sinon.useFakeTimers({ toFake: ["setTimeout", "nextTick"] });
```

To fake everything including `nextTick`:

```js
sinon.useFakeTimers({
  toFake: [
    "setTimeout",
    "clearTimeout",
    "setInterval",
    "clearInterval",
    "setImmediate",
    "clearImmediate",
    "Date",
    "nextTick",
    "hrtime",
    "performance"
  ]
});
```

### `config.toNotFake`

Instead of specifying what to fake, you can specify what NOT to fake:

```js
sinon.useFakeTimers({ toNotFake: ["Date"] });
```

This will fake all supported methods except `Date`.

### `config.shouldAdvanceTime`

This tells fake timers to automatically advance time based on real system time changes. Useful when you don't know when to call `tick()`:

```js
sinon.useFakeTimers({ shouldAdvanceTime: true });
```

Note: This uses `setInterval` at a configurable interval (default 20ms) to check for time changes, not real-time advancement.

### `config.target`

Useful when using JSDOM or other sandboxed environments:

```js
sinon.useFakeTimers({ target: jsdomWindow });
```

### Example with multiple config options

```js
import t from "tap";
import sinon from "sinon";

t.test("useFakeTimers with nextTick requires manual flushing", (t) => {
  const clock = sinon.useFakeTimers({
    now: 1483228800000,
    toFake: ["setTimeout", "nextTick"]
  });

  let called = false;

  process.nextTick(function () {
    called = true;
  });

  // nextTick doesn't execute automatically
  t.notOk(called, "callback should not be called yet");

  // Forces nextTick calls to flush synchronously
  clock.runAll();

  // Verify callback was executed
  t.ok(called, "callback should be called after runAll");

  clock.restore();
  t.end();
});

```

### With `shouldAdvanceTime` example

```js
import t from "tap";
import sinon from "sinon";

t.test(
  "useFakeTimers with shouldAdvanceTime runs timers automatically",
  async (t) => {
    const clock = sinon.useFakeTimers({
      now: 1483228800000,
      shouldAdvanceTime: true
    });

    const immediate = sinon.fake();
    const timeout1 = sinon.fake();
    const timeout2 = sinon.fake();

    setImmediate(immediate);

    setTimeout(timeout1, 15);

    setTimeout(timeout2, 35);

    // Wait for auto-advancement to trigger timers
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Verify all callbacks were executed
    t.ok(immediate.calledOnce, "setImmediate callback should be called");
    t.ok(timeout1.calledOnce, "first setTimeout callback should be called");
    t.ok(timeout2.calledOnce, "second setTimeout callback should be called");

    clock.restore();
    t.end();
  }
);

```

### Using async/await

```js
import t from "tap";
import sinon from "sinon";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

t.test("useFakeTimers with async/await using tickAsync", async (t) => {
  const clock = sinon.useFakeTimers();

  const logs = [];

  async function asyncFn() {
    await wait(100);
    logs.push({ msg: "resolved 1", time: Date.now() });

    await wait(10);
    logs.push({ msg: "resolved 2", time: Date.now() });
  }

  setTimeout(() => logs.push({ msg: "timeout", time: Date.now() }), 200);

  // NOTE: no `await` here - it would hang, as the clock is stopped
  asyncFn();

  await clock.tickAsync(200);

  // Verify all async operations completed in correct order
  t.equal(logs.length, 3, "should have 3 log entries");
  t.same(logs[0], { msg: "resolved 1", time: 100 });
  t.same(logs[1], { msg: "resolved 2", time: 110 });
  t.same(logs[2], { msg: "timeout", time: 200 });

  clock.restore();
  t.end();
});

```
