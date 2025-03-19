---
layout: page
title: Migrating between versions
breadcrumb: migrating
redirect_from:
  - /guides/migrating-to-2.0/
  - /releases/latest/migrating-to-2.0/
  - /guides/migrating-to-3.0/
  - /releases/latest/migrating-to-3.0/
  - /guides/migrating-to-4.0/
  - /guides/migrating-to-5.0/
  - /guides/migrating-to-6.0/
---

## Sinon 19

### All timers are stubbed by default

A breaking change is that Fake Timers 13 now fake all timers by default. Previously
Node's `nextTick()` and `Window#queueMicroTask()` were explicitly skipped, which
was quite confusing to some. This typically might affect `async` tests where
you rely on some Node function that invokes `nextTick` under the hood. See
[issue #2619](https://github.com/sinonjs/sinon/issues/2619) for such an example
and [a suggestion on how one could employ `clock#runToLastAsync()`](https://github.com/fatso83/usefaketimers-bug-reproduction/commit/54c812d)
in asynchronous tests that stopped resolving in Sinon 19.

_If you want the old behavior, specify the timers you want to fake in the `toFake`
option and leave out the name of the timers giving you trouble_.

### New implementation of the fake Date class

The new version of fake-timers also no longer creating dates using the original Date
class, but a _subclass_ (proxy). This should not matter _unless_ you are doing some kind
of identity checks on the constructor: functionally they are the same.
See ([fake-timers#504](https://github.com/sinonjs/fake-timers/issues/504)) for an
example (which we ended up pushing a small fix for to make `instanceof` work as before).

### Removal of `useFakeServer({legacyRoutes: true})`

The `legacyRoutes` option that was enabled in a previous version has been removed.
An underlying library, `path-to-regexp`, had a fundamental change to its parsing that
made the option a no-op. This should not affect most users of Sinon.

## Sinon 18

Mostly removal of some deprecated exports related to `sinon-test`, such as
sinon.defaultConfig and related modules.

## Sinon 17

Drops support for Node 16

## Sinon 15

Removes option to pass a custom formatter.

## Sinon 7

For users upgrading to Sinon 7 the only known breaking API change is that
**negative ticks** are not allowed in `Sinon@7` due to updating to lolex 3
internally. This means you cannot use negative values in
sinon.useFakeTimers().tick();

If you experience any issues moving from Sinon 6 to Sinon 7, please let us
know! https://github.com/sinonjs/sinon/issues/new?template=Bug_report.md.

## Sinon 6

There should be no reason for any code changes with the new Sinon 6.
Usually, `MAJOR` releases should come with breaking changes, but there are
no known breaking changes in `sinon@6` at the time of this writing. We chose
to release a new major version as a pragmatic solution to some noise related
to releasing Sinon 5.1 https://github.com/sinonjs/sinon/pull/1829#issue-
193284761, which featured some breaking changes related to ESM (which since
has been resolved).

If you should experience any issues moving from Sinon 5 to Sinon 6, please
let us know!
https://github.com/sinonjs/sinon/issues/new?template=Bug_report.md.

## Sinon 5

As with all `MAJOR` releases in semver http://semver.org/, there are
breaking changes in `sinon@5`.
This guide will walk you through those changes.

## `spy.reset()` is removed, use `spy.resetHistory()`

In a previous version we deprecated and aliased `spy.reset` in favour of
using `spy.resetHistory`. `spy.reset` has now been removed, you should use
`spy.resetHistory`.

## `sinon` is now a (default) sandbox

Since `sinon@5.0.0`, the `sinon` object is a default sandbox. Unless you
have a very advanced setup or need a special configuration, you probably
want to only use that one.

The old sandbox API is still available, so you don't **have** to do
anything.

However, switching to using the default sandbox can help make your code more
concise.
Now would be a good opportunity to tidy up your tests.

### Before `sinon@5.0.0`

In earlier versions, you would manually have to create sandboxes and keep
references to them in order to restore them.

const sandbox = sinon.createSandbox();

describe("myFunction", function () {
afterEach(function () {
sandbox.restore();
});

it("should make pie");
});

### From `sinon@5.0.0`

describe("myFunction", function () {
afterEach(function () {
sinon.restore();
});

it("should make pie");
});

## Sinon 4

As with all `MAJOR` releases in semver http://semver.org/, there are
breaking changes in `sinon@4`.
This guide will walk you through those changes.

## `sinon.stub(obj, 'nonExistingProperty')` - Throws

Trying to stub a non-existing property will now fail, to ensure you are
creating
less error-prone tests https://github.com/sinonjs/sinon/pull/1557.

## Sinon 3

As with all `MAJOR` releases in semver http://semver.org/, there are
breaking changes in `sinon@3`.
This guide will walk you through those changes.

## `sinon.stub(object, "method", func)` - Removed

Please use `sinon.stub(obj, "method").callsFake(func)` instead.

var stub = sinon.stub(obj, "stubbedMethod").callsFake(function () {
return 42;
});

A codemod is available https://github.com/hurrymaplelad/sinon-codemod to
upgrade your code

## `sinon.stub(object, property, value)` - Removed

Calling `sinon.stub` with three arguments will throw an Error. This was
deprecated with `sinon@2` and has been removed with `sinon@3`

## `sinon.useFakeTimers([now, ]prop1, prop2, ...)` - Removed

`sinon.useFakeTimers()` signature has changed
To define which methods to fake,
please use `config.toFake`. Other options are now available when configuring
`useFakeTimers`. Please consult the documentation for more information.

## `sinon.sandbox.create(config)` - Config changes

The changes in configuration for fake timers implicitly affect sandbox creation.
If your config used to look
like `{ useFaketimers: ["setTimeout", "setInterval"]}`, you
will now need to change it to `{ useFaketimers: { toFake: ["setTimeout",
"setInterval"] }}`.

## `sandbox.stub(obj, 'nonExistingProperty')` - Throws

Trying to stub a non-existing property will now fail to ensure you are
creating
less error-prone tests
https://github.com/sinonjs/sinon/issues/1537#issuecomment-323948482.

## Removal of internal helpers

The following internal functions were deprecated as of `sinon@1.x` and have
been removed in `sinon@3`:

• `sinon.calledInOrder`
• `sinon.create`
• `sinon.deepEqual`
• `sinon.format`
• `sinon.functionName`
• `sinon.functionToString`
• `sinon.getConfig`
• `sinon.getPropertyDescriptor`
• `sinon.objectKeys`
• `sinon.orderByFirstCall`
• `sinon.restore`
• `sinon.timesInWorlds`
• `sinon.valueToString`
• `sinon.walk`
• `sinon.wrapMethod`
• `sinon.Event`
• `sinon.CustomEvent`
• `sinon.EventTarget`
• `sinon.ProgressEvent`
• `sinon.typeOf`
• `sinon.extend`

## Sinon 2

Sinon v2.0 is the second major release, we have made several breaking
changes in this release as a result of modernising the internals of Sinon.
This guide is intended to walk you through the changes.

## sinon.log and sinon.logError Removed

`sinon.log` and `sinon.logError` were used in Sinon v1.x to globally
configure `FakeServer`, `FakeXMLHttpRequest` and `FakeXDomainRequest`; these
three functions now allow the logger to be configured on a per-use basis. In
v1.x you may have written:

sinon.log = function (msg) { // your logging impl };

You would now individually import and configure the utility upon creation:

var sinon = require("sinon");

var myFakeServer = sinon.fakeServer.create({
logger: function (msg) { // your logging impl }
});

## sinon.test, sinon.testCase and sinon.config Removed

`sinon.test` and `sinon.testCase` have been extracted from the Sinon API and
moved into their own node module, sinon-test
https://www.npmjs.com/package/sinon-test. Please refer to the sinon-test
README https://github.com/sinonjs/sinon-test/blob/master/README.md for
migration examples.

## stub.callsFake replaces stub(obj, 'meth', fn)

`sinon.stub(obj, 'meth', fn)` return a spy, not a full stub. Behavior could
not be redefined. `stub.callsFake`
now returns a full stub. Here's a codemod script
https://github.com/hurrymaplelad/sinon-codemod to help you migrate.
See discussion https://github.com/sinonjs/sinon/pull/823.

// Old
sinon.stub(obj, "meth", fn);
// New
sinon.stub(obj, "meth").callsFake(fn);

## stub.resetHistory replaces stub.reset

`stub.reset()` now resets the history and the behaviour of the stub.
Previously `stub.reset()` only reset the history of the stub. Stubs now have
separate methods for resetting the history and the behaviour. To mimic the
old behaviour replace all `stub.reset()` calls with `stub.resetHistory()`.

// Old
stub.reset();
// New
stub.resetHistory();

## Deprecation of internal helpers

The following utility functions are being marked as deprecated and are
planned for removal in Sinon v3.0; please check your codebase for usage to
ease future migrations:

• `sinon.calledInOrder`
• `sinon.create`
• `sinon.deepEqual`
• `sinon.format`
• `sinon.functionName`
• `sinon.functionToString`
• `sinon.getConfig`
• `sinon.getPropertyDescriptor`
• `sinon.objectKeys`
• `sinon.orderByFirstCall`
• `sinon.restore`
• `sinon.timesInWorlds`
• `sinon.valueToString`
• `sinon.walk`
• `sinon.wrapMethod`
• `sinon.Event`
• `sinon.CustomEvent`
• `sinon.EventTarget`
• `sinon.ProgressEvent`
• `sinon.typeOf`
• `sinon.extend`

## `sandbox.useFakeXMLHttpRequest` no longer returns a "server"

In Sinon 1.x, the sandbox' `useFakeXMLHttpRequest` was the same as its
`useFakeServer`. In 2.x, it maps directly to `sinon.useFakeXMLHttpRequest`
(but with sandboxing). If you use `sandbox.useFakeXMLHttpRequest`, replace
it with `sandbox.useFakeServer`, and your tests should behave as they always
did.

## `sinon.behavior` is gone

The `sinon.behavior` object is no longer exposed for random modification.
However, there is a new mechanism in place aided to add new behavior to
stubs, `sinon.addBehavior(name, fn)`, see the stub docs.
