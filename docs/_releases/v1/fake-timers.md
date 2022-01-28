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

When faking timers with IE you also need `sinon-ie.js`, which
should be loaded after `sinon.js`.

For standalone usage of fake timers it is recommended to use [lolex](https://github.com/sinonjs/lolex) package instead. It provides the same
set of features and was previously extracted from Sinon.JS.

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

Causes Sinon to replace the global `setTimeout`, `clearTimeout`, `setInterval`, `clearInterval` and `Date` with a custom implementation which is bound to the returned `clock` object.

Starts the clock at the UNIX epoch (timestamp of 0).


#### `var clock = sinon.useFakeTimers(now);`

As above, but rather than starting the clock with a timestamp of 0, start at the provided timestamp.


#### `var clock = sinon.useFakeTimers([now, ]prop1, prop2, ...);`

Sets the clock start timestamp and names functions to fake.

Possible functions are setTimeout, clearTimeout, setInterval, clearInterval, and Date. Can also be called without the timestamp.


#### `clock.tick(ms);`

Tick the clock ahead `ms` milliseconds.

Causes all timers scheduled within the affected time range to be called.


#### `clock.restore();`

Restore the faked methods.

Call in e.g. `tearDown`.
