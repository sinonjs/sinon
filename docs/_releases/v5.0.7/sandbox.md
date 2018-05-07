---
layout: page
title: Sandboxes - Sinon.JS
breadcrumb: sandbox
---

Sandboxes removes the need to keep track of every fake created, which greatly simplifies cleanup.

```javascript
var sandbox = require('sinon').sandbox;
var myAPI = { hello: function () {} };

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
        sandbox.assert.calledOnce(myAPI.hello);
    });

    it('should be called twice', function () {
        myAPI.hello();
        myAPI.hello();
        sandbox.assert.calledTwice(myAPI.hello);
    });
});
```

## Sandbox API

#### Default sandbox

Since `sinon@5.0.0`, the `sinon` object is a default sandbox. Unless you have a very advanced setup or need a special configuration, you probably want to just use that one.

#### `var sandbox = sinon.createSandbox();`

Creates a new sandbox object with spies, stubs, and mocks.

#### `var sandbox = sinon.createSandbox(config);`

The `sinon.createSandbox(config)` method is often an integration feature, and can be used for scenarios including a global object to coordinate all fakes through.

Sandboxes are partially configured by default such that calling:

```javascript
var sandbox = sinon.createSandbox({});
```

will merge in extra defaults analogous to:

```javascript
var sandbox = sinon.createSandbox({
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
var sandbox = sinon.createSandbox(sinon.defaultConfig);

// (OR) Add the extra properties that differ from the sinon defaults.
var sandbox = sinon.createSandbox({
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

If set to `true`, the sandbox will have a `clock` property. You can optionally pass
in a configuration object that follows the [specification for fake timers](../fake-timers),
such as `{ toFake: ["setTimeout", "setInterval"] }`.

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

#### `sandbox.replace(object, property, replacement);`

Replaces `property` on `object` with `replacement` argument. Attempts to replace an already replaced value cause an exception.

`replacement` can be any value, including `spies`, `stubs` and `fakes`.

This method only works on non-accessor properties, for replacing accessors, use `sandbox.replaceGetter()` and `sandbox.replaceSetter()`.


```js
var myObject = {
    myMethod: function() {
        return 'apple pie';
    }
};

sandbox.replace(myObject, 'myMethod', function () {
    return 'strawberry';
});

console.log(myObject.myMethod());
// strawberry
```

#### `sandbox.replaceGetter();`

Replaces getter for `property` on `object` with `replacement` argument. Attempts to replace an already replaced getter cause an exception.

`replacement` must be a `Function`, and can be instances of `spies`, `stubs` and `fakes`.

```js
var myObject = {
    get myProperty: function() {
        return 'apple pie';
    }
};

sandbox.replaceGetter(myObject, 'myMethod', function () {
    return 'strawberry';
});

console.log(myObject.myProperty);
// strawberry
```

#### `sandbox.replaceSetter();`

Replaces setter for `property` on `object` with `replacement` argument. Attempts to replace an already replaced setter cause an exception.

`replacement` must be a `Function`, and can be instances of `spies`, `stubs` and `fakes`.

```js
var object = {
    set myProperty(value) {
        this.prop = value;
    }
};

sandbox.replaceSetter(object, 'myProperty', function (value) {
    this.prop = 'strawberry ' + value;
});

object.myProperty = 'pie';

console.log(object.prop);
// strawberry pie
```

#### `sandbox.spy();`

Works exactly like `sinon.spy`

#### `sandbox.createStubInstance();`

Works almost exactly like `sinon.createStubInstance`, only also adds the returned stubs to the internal collection of fakes for easy restoring through `sandbox.restore()`.

#### `sandbox.stub();`

Works exactly like `sinon.stub`.


##### Stubbing a non-function property
```javascript
const myObject = {
    'hello': 'world'
};

sandbox.stub(myObject, 'hello').value('Sinon');

console.log(myObject.hello);
// Sinon

sandbox.restore();
console.log(myObject.hello);
// world
```

#### `sandbox.mock();`

Works exactly like `sinon.mock`


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
