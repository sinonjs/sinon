---
layout: page
title: Migrating to v3.0 - Sinon.JS
breadcrumb: migrating to 3.0
---

As with all `MAJOR` releases in [`semver`](http://semver.org/), there are breaking changes in `sinon@3`.
This guide will walk you through those changes.

## `sinon.stub(object, "method", func)` - Removed
Please use `sinon.stub(obj, "method").callsFake(func)` instead.

```js
var stub = sinon.stub(obj, "stubbedMethod").callsFake(function () {
    return 42;
});
```

A [codemod is available](https://github.com/hurrymaplelad/sinon-codemod) to upgrade your code

## `sinon.stub(object, property, value)` - Removed
Calling `sinon.stub` with three arguments will throw an Error. This was deprecated with `sinon@2` and has been removed with `sinon@3`

## `sinon.useFakeTimers([now, ]prop1, prop2, ...)` - Removed
`sinon.useFakeTimers()` signature has [changed](../fake-timers). To define which methods to fake, please use `config.toFake`. Other options are now available when configuring `useFakeTimers`. Please consult the [documentation](../fake-timers) for more information.

## `sinon.sandbox.create(config)` - Config changes
The [changes in configuration](../fake-timers) for fake timers implicitly affect sandbox creation. If your config used to look like `{ useFaketimers: ["setTimeout", "setInterval"]}`, you
will now need to change it to `{ useFaketimers: { toFake: ["setTimeout", "setInterval"] }}`.

## Removal of internal helpers
The following internal functions were deprecated as of `sinon@1.x` and have been removed in `sinon@3`:

* `sinon.calledInOrder`
* `sinon.create`
* `sinon.deepEqual`
* `sinon.format`
* `sinon.functionName`
* `sinon.functionToString`
* `sinon.getConfig`
* `sinon.getPropertyDescriptor`
* `sinon.objectKeys`
* `sinon.orderByFirstCall`
* `sinon.restore`
* `sinon.timesInWorlds`
* `sinon.valueToString`
* `sinon.walk`
* `sinon.wrapMethod`
* `sinon.Event`
* `sinon.CustomEvent`
* `sinon.EventTarget`
* `sinon.ProgressEvent`
* `sinon.typeOf`
* `sinon.extend`
