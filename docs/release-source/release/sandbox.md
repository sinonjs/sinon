---
layout: page
title: Sandboxes - Sinon.JS
breadcrumb: sandbox
---

Sandboxes removes the need to keep track of every fake created, which greatly simplifies cleanup.

```javascript
var sinon = require('sinon');

var myAPI = { hello: function () {} };
var sandbox = sinon.sandbox.create();

describe('myAPI.hello method', function () {

    beforeEach(function () {
        // stub out the `hello` method
        sandbox.stub(myAPI, 'hello');
    });

    afterEach(function () {
        // completely restore all fakes created through the sandbox
        sandbox.restore();
    });

    it('should be called once', function () {
        myAPI.hello();
        sinon.assert.calledOnce(myAPI.hello);
    });

    it('should be called twice', function () {
        myAPI.hello();
        myAPI.hello();
        sinon.assert.calledTwice(myAPI.hello);
    });
});
```

## Sandbox API

#### `var sandbox = sinon.sandbox.create();`

Creates a sandbox object with spies, stubs, and mocks.


#### `var sandbox = sinon.sandbox.create(config);`

The `sinon.sandbox.create(config)` method is often an integration feature, and can be used for scenarios including a global object to coordinate all fakes through.

Sandboxes are partially configured by default such that calling:

```javascript
var sandbox = sinon.sandbox.create({});
```

will merge in extra defaults analogous to:

```javascript
var sandbox = sinon.sandbox.create({
    // ...
    injectInto: null,
    properties: ["spy", "stub", "mock"],
    useFakeTimers: false,
    useFakeServer: false
});
```

The `useFakeTimers` and `useFakeServers` are **false** as opposed to the defaults in `sinon.defaultConfig`:

```javascript
sinon.defaultConfig = {
    // ...
    injectInto: null,
    properties: ["spy", "stub", "mock", "clock", "server", "requests"],
    useFakeTimers: true,
    useFakeServer: true
}
```

To get a full sandbox with stubs, spies, etc. **and** fake timers and servers, you can call:

```javascript
// Inject the sinon defaults explicitly.
var sandbox = sinon.sandbox.create(sinon.defaultConfig);

// (OR) Add the extra properties that differ from the sinon defaults.
var sandbox = sinon.sandbox.create({
    useFakeTimers: true
    useFakeServer: true
});
```

##### injectInto

The sandbox's methods can be injected into another object for convenience. The
`injectInto` configuration option can name an object to add properties to.

##### properties

What properties to inject. Note that simply naming "server" here is not
sufficient to have a `server` property show up in the target object, you also
have to set `useFakeServer` to `true`.

##### useFakeTimers

If `true`, the sandbox will have a `clock` property. Can also be an `Array` of
timer properties to fake.

##### useFakeServer

If `true`, `server` and `requests` properties are added to the sandbox. Can
also be an object to use for fake server. The default one is `sinon.fakeServer`,
but if you're using jQuery 1.3.x or some other library that does not set the XHR's
`onreadystatechange` handler, you might want to do:

```javascript
sinon.config = {
    useFakeServer: sinon.fakeServerWithClock
};
```

#### `sandbox.assert();`

A convenience reference for [`sinon.assert`](./assertions)

*Since `sinon@2.0.0`*

#### `sandbox.spy();`

Works exactly like `sinon.spy`, only also adds the returned spy to the internal collection of fakes for easy restoring through `sandbox.restore()`


#### `sandbox.stub();`

Works almost exactly like `sinon.stub`, only also adds the returned stub to the internal collection of fakes for easy restoring through `sandbox.restore()`.

The sandbox `stub` method can also be used to stub any kind of property. This is useful if you need to override an object's property for the duration of a test, and have it restored when the test completes.

#### `sandbox.mock();`

Works exactly like `sinon.mock`, only also adds the returned mock to the internal collection of fakes for easy restoring through `sandbox.restore()`


#### `sandbox.useFakeTimers();`

Fakes timers and binds the `clock` object to the sandbox such that it too is restored when calling `sandbox.restore()`.

Access through `sandbox.clock`.


#### `sandbox.useFakeXMLHttpRequest();`

Fakes XHR and binds the resulting object to the sandbox such that it too is restored when calling `sandbox.restore()`.

Since 2.x, you can no longer access requests through `sandbox.requests` - use `sandbox.useFakeServer` to do this. This function maps to `sinon.useFakeXMLHttpRequest`, only with sandboxing.


#### `sandbox.useFakeServer();`

Fakes XHR and binds a server object to the sandbox such that it too is restored when calling `sandbox.restore()`.

Access requests through `sandbox.requests` and server through `sandbox.server`

#### `sandbox.usingPromise(promiseLibrary);`

Causes all stubs created from the sandbox to return promises using a specific
Promise library instead of the global one when using `stub.rejects` or
`stub.resolves`. Returns the stub to allow chaining.

*Since `sinon@2.0.0`*

#### `sandbox.restore();`

Restores all fakes created through sandbox.

#### `sandbox.reset();`

Resets the internal state of all fakes created through sandbox.

#### `sandbox.resetBehavior();`

Resets the behaviour of all stubs created through the sandbox.

*Since `sinon@2.0.0`*

#### `sandbox.resetHistory();`

Resets the history of all stubs created through the sandbox.

*Since `sinon@2.0.0`*

#### `sandbox.verify();`

Verifies all mocks created through the sandbox.

#### `sandbox.verifyAndRestore();`

Verifies all mocks and restores all fakes created through the sandbox.
