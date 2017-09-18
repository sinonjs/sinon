---
layout: page
title: Migrating to v2.0 - Sinon.JS
breadcrumb: migrating to 2.0
---

Sinon v2.0 is the second major release, we have made several breaking changes in this release as a result of modernising the internals of Sinon.  This guide is intended to walk you through the changes.

## sinon.log and sinon.logError Removed
`sinon.log` and `sinon.logError` were used in Sinon v1.x to globally configure `FakeServer`, `FakeXMLHttpRequest` and `FakeXDomainRequest`; these three functions now allow the logger to be configured on a per-use basis.  In v1.x you may have written:

```js
sinon.log = function (msg) { // your logging impl };
```

You would now individually import and configure the utility upon creation:

```js
var sinon = require("sinon");

var myFakeServer = sinon.fakeServer.create({
 logger: function (msg) { // your logging impl }
});
```

## sinon.test, sinon.testCase and sinon.config Removed
`sinon.test` and `sinon.testCase` have been extracted from the Sinon API and moved into their own node module, [sinon-test](https://www.npmjs.com/package/sinon-test). Please refer to the [sinon-test README](https://github.com/sinonjs/sinon-test/blob/master/README.md) for migration examples.

## stub.callsFake replaces stub(obj, 'meth', fn)
`sinon.stub(obj, 'meth', fn)` return a spy, not a full stub. Behavior could not be redefined. `stub.callsFake`
now returns a full stub. Here's a [codemod script](https://github.com/hurrymaplelad/sinon-codemod) to help you migrate.
See [discussion](https://github.com/sinonjs/sinon/pull/823).

```js
// Old
sinon.stub(obj, 'meth', fn);
// New
sinon.stub(obj, 'meth').callsFake(fn);
```

## Deprecation of internal helpers
The following utility functions are being marked as deprecated and are planned for removal in Sinon v3.0; please check your codebase for usage to ease future migrations:

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

## `sandbox.useFakeXMLHttpRequest` no longer returns a "server"

In Sinon 1.x, the sandbox' `useFakeXMLHttpRequest` was the same as its `useFakeServer`. In 2.x, it maps directly to `sinon.useFakeXMLHttpRequest` (but with sandboxing). If you use `sandbox.useFakeXMLHttpRequest`, just replace it with `sandbox.useFakeServer`, and your tests should behave as they always did.

## `sinon.behavior` is gone

The `sinon.behavior` object is no longer exposed for random modification. However, there is a new mechanism in place aided to add new behavior to stubs, `sinon.addBehavior(name, fn)`, see the stub docs.
