---
layout: page
title: Fake timers - Sinon.JS
breadcrumb: fake timers
---

Fake timers are synchronous implementations of `setTimeout` and friends that
Sinon.JS can overwrite the global functions with to allow you to more easily
test code using them.

Fake timers provide a `clock` object to pass time, which can also be used to control `Date` objects created through either `new Date();`
or `Date.now();` (if supported by the browser).

For standalone usage of fake timers it is recommended to use [lolex](https://github.com/sinonjs/lolex) package instead. It provides the same
set of features (Sinon uses it under the hood) and was previously extracted from Sinon.JS.

```javascript
{
    setUp: function () {
        this.clock = sinon.useFakeTimers();
    },

    tearDown: function () {
        this.clock.restore();
    },

    "test should animate element over 500ms" : function(){
        var el = jQuery("<div></div>");
        el.appendTo(document.body);

        el.animate({ height: "200px", width: "200px" });
        this.clock.tick(510);

        assertEquals("200px", el.css("height"));
        assertEquals("200px", el.css("width"));
    }
}
```

## Fake timers API


#### `var clock = sinon.useFakeTimers();`

Causes Sinon to replace the global `setTimeout`, `clearTimeout`, `setInterval`, `clearInterval`, `setImmediate`, `clearImmediate`, `process.hrtime`, `performance.now`(when available) and `Date` with a custom implementation which is bound to the returned `clock` object.

Starts the clock at the UNIX epoch (timestamp of `0`).


#### `var clock = sinon.useFakeTimers(now);`

As above, but rather than starting the clock with a timestamp of 0, start at the provided timestamp `now`.

*Since `sinon@2.0.0`*

You can also pass in a Date object, and its `getTime()` will be used for the starting timestamp.

#### `var clock = sinon.useFakeTimers(config);`

As above, but allows further configuration options, some of which are:

- `config.now` - *Number/Date* - installs lolex with the specified unix epoch (default: 0)
- `config.toFake` - *String[ ]* - an array with explicit function names to fake. By default lolex will automatically fake all methods *except* `process.nextTick`. You could, however, still fake `nextTick` by providing it explicitly
- `config.shouldAdvanceTime` - *Boolean* - tells lolex to increment mocked time automatically based on the real system time shift (default: false)

Please visit the `lolex.install` [documentation](https://github.com/sinonjs/lolex#var-clock--lolexinstallconfig) for the full feature set.

**Important note:** when faking `nextTick`, normal calls to `process.nextTick()` would not execute automatically as they would during normal event-loop phases. You would have to call either `clock.next()`, `clock.tick()`, `clock.runAll()` or `clock.runToLast()` (see example below). Please refer to the [lolex](https://github.com/sinonjs/lolex) documentation for more information.

#### Examples

Installs fake timers at January 1st 2017 and fakes `setTimeout` and `process.nextTick` only:

```javascript
var clock = sinon.useFakeTimers({
                now: 1483228800000,
                toFake: ["setTimeout", "nextTick"]
            });

var called = false;

process.nextTick(function () {
    called = true;
});

clock.runAll(); //forces nextTick calls to flush synchronously
assert(called); //true
```

Install at the same date, advancing the fake time automatically (default is every `20ms`), causing timers to be fired automatically without the need to `tick()` the clock:

```js
var clock = sinon.useFakeTimers({
                now: 1483228800000,
                shouldAdvanceTime: true
            });

setImmediate(function () {
    console.log('tick'); //will print after 20ms
});

setTimeout(function () {
    console.log('tock'); //will print after 20ms
}, 15);

setTimeout(function () {
    console.log('tack'); //will print after 40ms
}, 35);
```

Please refer to the `lolex.install` [documentation](https://github.com/sinonjs/lolex#var-clock--lolexinstallconfig) for the full set of features available and more elaborate explanations.

*Since `sinon@3.0.0`*

`var clock = sinon.useFakeTimers([now, ]prop1, prop2, ...)` is no longer supported. To define which methods to fake, please use `config.toFake`.


#### `clock.tick(time);`

Tick the clock ahead `time` milliseconds.

Causes all timers scheduled within the affected time range to be called. `time` may be the number of milliseconds to advance the clock by or a human-readable string. Valid string formats are "08" for eight seconds, "01:00" for one minute and "02:34:10" for two hours, 34 minutes and ten seconds.

time may be negative, which causes the clock to change but won't fire any callbacks.

#### `clock.next();`

Advances the clock to the the moment of the first scheduled timer, firing it.

#### `clock.runAll();`

This runs all pending timers until there are none remaining. If new timers are added while it is executing they will be run as well.

This makes it easier to run asynchronous tests to completion without worrying about the number of timers they use, or the delays in those timers.

#### `clock.restore();`

Restore the faked methods.

Call in e.g. `tearDown`.
