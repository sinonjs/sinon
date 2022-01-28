---
layout: page
title: Sandboxes - Sinon.JS
breadcrumb: sandbox
---

Sandboxes simplify working with fakes that need to be restored and/or verified.

If you're using fake timers, fake XHR, or you are stubbing/spying on globally
accessible properties you should use a sandbox to ease cleanup. By default the
spy, stub and mock properties of the sandbox is bound to whatever object the
function is run on, so if you don't want to manually `restore()`, you have to
use `this.spy()` instead of `sinon.spy()` (and stub, mock).

```javascript
"test using sinon.test sandbox": sinon.test(function () {
    var myAPI = { method: function () {} };
    this.mock(myAPI).expects("method").once();

    PubSub.subscribe("message", myAPI.method);
    PubSub.publishSync("message", undefined);
})
```

## Sandbox API

#### `var sandbox = sinon.sandbox.create();`

Creates a sandbox object


#### `var sandbox = sinon.sandbox.create(config);`

The `sinon.sandbox.create(config)` method is mostly an integration feature, and as an end-user of Sinon.JS you will probably not need it.

Creates a pre-configured sandbox object. The configuration can instruct the sandbox to include fake timers, fake server, and how to interact with these.

The default configuration looks like:

```javascript
sinon.defaultConfig = {
    // ...
    injectInto: null,
    properties: ["spy", "stub", "mock", "clock", "server", "requests"],
    useFakeTimers: true,
    useFakeServer: true
}
```

<dl>
<dt><code>injectInto</code></dt>
  <dd>The sandbox's methods can be injected into another object for convenience. The <code>injectInto</code> configuration option can name an object to add properties to. Usually, this is set by <code>sinon.test</code> such that it is the <code>this</code> value in a given test function.</dd>

  <dt><code>properties</code></dt>
  <dd>What properties to inject. Note that simply naming "server" here is not sufficient to have a <code>server</code> property show up in the target object, you also have to set <code>useFakeServer</code> to <code>true</code>.
  </dd>

  <dt><code>useFakeTimers</code></dt>
  <dd>If <code>true</code>, the sandbox will have a <code>clock</code> property. Can also be an <code>Array</code> of timer properties to fake.</dd>

  <dt><code>useFakeServer</code></dt>
  <dd>If <code>true</code>, <code>server</code> and <code>requests</code> properties are added to the sandbox. Can also be an object to use for fake server. The default one is <code>sinon.fakeServer</code>, but if you're using jQuery 1.3.x or some other library that does not set the XHR's <code>onreadystatechange</code> handler, you might want to do:

  <code>sinon.config = {
    useFakeServer: sinon.fakeServerWithClock
};</code></dd>
</dl>


#### `sandbox.spy();`

Works exactly like `sinon.spy`, only also adds the returned spy to the internal collection of fakes for easy restoring through `sandbox.restore()`


#### `sandbox.stub();`

Works almost exactly like `sinon.stub`, only also adds the returned stub to the internal collection of fakes for easy restoring through `sandbox.restore()`.

The sandbox `stub` method can also be used to stub any kind of property. This is useful if you need to override an object's property for the duration of a test, and have it restored when the test completes

#### `sandbox.mock();`

Works exactly like `sinon.mock`, only also adds the returned mock to the internal collection of fakes for easy restoring through `sandbox.restore()`


#### `sandbox.useFakeTimers();`

Fakes timers and binds the `clock` object to the sandbox such that it too is restored when calling `sandbox.restore()`.

Access through `sandbox.clock`.


#### `sandbox.useFakeXMLHttpRequest();`

Fakes XHR and binds the resulting object to the sandbox such that it too is restored when calling `sandbox.restore()`.

Access requests through `sandbox.requests`.


#### `sandbox.useFakeServer();`

Fakes XHR and binds a server object to the sandbox such that it too is restored when calling `sandbox.restore()`.

Access requests through `sandbox.requests` and server through `sandbox.server`


#### `sandbox.restore();`

Restores all fakes created through sandbox.

#### `sandbox.reset();`

Resets the internal state of all fakes created through sandbox.

#### `sandbox.verify();`

Verifies all mocks created through the sandbox.

#### `sandbox.verifyAndRestore();`

Verifies all mocks and restores all fakes created through the sandbox.

## Test methods

**Note:** In `sinon@2.0.0` this has been extracted into a [separate sinon-test module](https://www.npmjs.com/package/sinon-test).

Wrapping test methods in `sinon.test` allows Sinon.JS to automatically create
and manage sandboxes for you. The function's behavior can be configured through
`sinon.config`.


#### `var wrappedFn = sinon.test(fn);``

The `wrappedFn` function works exactly like the original one in all respects - in addition a sandbox object is created and automatically restored when the function finishes a call.

By default the spy, stub and mock properties of the sandbox is bound to whatever object the function is run on, so you can do `this.spy()` (and stub, mock) and it works exactly like `sandbox.spy()` (and stub, mock), except you don't need to manually `restore()`.


```javascript
{
    injectIntoThis: true,
    injectInto: null,
    properties: ["spy", "stub", "mock", "clock", "server", "requests"],
    useFakeTimers: true,
    useFakeServer: true
}
```

Simply set `sinon.config` to override any or all of these, e.g.:

```javascript
sinon.config = {
    useFakeTimers: false,
    useFakeServer: false
}
```

In this case, defaults are used for the non-existent properties. Additionally,
sandboxes and tests will not have automatic access to the fake timers and fake
server when using this configuration.

## sinon.config

The configuration controls how Sinon binds properties when using `sinon.test`.

The default configuration looks like:

<dl>
    <dt><code>Boolean injectIntoThis</code></dt>
    <dd>Causes properties to be injected into the `this` object of the test
    function. Default <code>true</code>.</dd>

    <dt><code>Object injectInto</code></dt>
    <dd>Object to bind properties to. If this is <code>null</code> (default) and <code>injectIntoThis</code> is <code>false</code> (not default), the properties are passed as arguments to the test function instead.</dd>

    <dt><code>Array properties</code></dt>
    <dd>Properties to expose. Default is all: <code>["spy", "stub", "mock", "clock", "server", "requests"]</code>. However, the last three properties are only bound if the following two configuration options are <code>true</code> (which is the default).</dd>

    <dt><code>Boolean useFakeTimers</code></dt>
    <dd>Causes timers to be faked and allows <code>clock</code> property to be exposed. Default is <code>true</code>.</dd>

    <dt><code>Boolean useFakeServer</code></dt>
    <dd>Causes fake XHR and server to be created and allows <code>server</code> and <code>requests</code> properties to be exposed. Default is <code>true</code>.</dd>
</dl>

## Test cases

If you need the behavior of `sinon.test` for more than one test method in a test case, you can use `sinon.testCase`, which behaves exactly like wrapping each test in `sinon.test` with one exception: `setUp` and
`tearDown` can share fakes.

#### `var obj = sinon.testCase({});`
