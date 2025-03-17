---
layout: page
title: Sandboxes - Sinon.JS
breadcrumb: sandbox
---

Sandboxes remove the need to keep track of every fake created, which greatly simplifies cleanup.

```javascript
const sandbox = require("sinon").createSandbox();
const myAPI = { hello: function () {} };

describe("myAPI.hello method", function () {
  beforeEach(function () {
    // stub out the `hello` method
    sandbox.stub(myAPI, "hello");
  });

  afterEach(function () {
    // completely restore all fakes created through the sandbox
    sandbox.restore();
  });

  it("should be called once", function () {
    myAPI.hello();
    sandbox.assert.calledOnce(myAPI.hello);
  });

  it("should be called twice", function () {
    myAPI.hello();
    myAPI.hello();
    sandbox.assert.calledTwice(myAPI.hello);
  });
});
```

## Default sandbox

Since Sinon 5, the `sinon` object is a default sandbox in itself! Unless you have a very advanced setup or need a special configuration, you probably only need to use that one in your tests for easy cleanup.

This also means all of the sandbox API is exposed on the default `sinon` instance.

```javascript
const myObject = {
  hello: "world",
};

sinon.stub(myObject, "hello").value("Sinon");

console.log(myObject.hello);
// Sinon

sinon.restore();
console.log(myObject.hello);
// world
```

## Sandbox API

#### `const sandbox = sinon.createSandbox();`

Creates a new sandbox object with spies, stubs, and mocks.

#### `const sandbox = sinon.createSandbox(config);`

The `sinon.createSandbox(config)` method is often an integration feature, and can be used for scenarios including a global object to coordinate all fakes through.

The default sandbox config has faking of XHR and timers turned off.

To get a full sandbox with stubs, spies, etc. **and** fake timers, you explicitly enable the additional features:

```javascript
const sandbox = sinon.createSandbox({
  useFakeTimers: true,
});
```

##### `injectInto`

The sandbox's methods can be injected into another object for convenience. The
`injectInto` configuration option can name an object to add properties to. Note that you explicitly need to specify all the properties you want to expose using the `properties` field.

See the example further down the page.

##### `properties`

Which properties to inject into the facade object. By default empty!

The list of properties that can be injected are the ones exposed by the object
returned by the function `inject`:

```javascript
console.log(Object.keys(sinon.inject(obj)))
    "spy",
    "stub",
    "mock",
    "createStubInstance",
    "fake",
    "replace",
    "replaceSetter",
    "replaceGetter",
    "match",
    // If enabled:
    // sinon.useFakeTimers();
    "clock",
```

##### `assertOptions`

You can override the default behavior and limit the amount of
characters if the error strings should somehow be overwhelming
and overflow your display.

```javascript
@property {boolean} shouldLimitAssertionLogs
@property {number}  assertionLogLimit
```

<div data-example-id="sandbox-configuration"></div>

#### `inject(facadeObject)`

This is injects all the properties of the sandbox into the facade object.
This is equivalent to specifying all the available properties in `properties` when you create a sandbox with `injectInto`.

##### `useFakeTimers`

If set to `true`, the sandbox will have a `clock` property. You can optionally pass
in a configuration object that follows the [specification for fake timers](../fake-timers),
such as `{ toFake: ["setTimeout", "setInterval"] }`.

##### Exposing sandbox example

To create an object `sandboxFacade` which gets the method `spy` injected, you
can code:

```javascript
// object that will have the spy method injected into it
const sandboxFacade = {};

// create sandbox and inject properties (in this case spy) into sandboxFacade
const sandbox = sinon.createSandbox({
  injectInto: sandboxFacade,
  properties: ["spy"],
});
```

Alternatively you can use the `sandbox.inject({})` method, which will inject all the sandbox methods by default, which is _usually_ what you want.

```javascript
const myFacade = sandbox.inject({});
```

#### `sandbox.assert();`

A convenience reference for [`sinon.assert`](../assertions)

_Since `sinon@2.0.0`_

#### `sandbox.define(object, property, value);`

Defines the `property` on `object` with the value `value`. Attempts to define an already defined value cause an exception.

`value` can be any value except `undefined`, including `spies`, `stubs` and `fakes`.

```js
const myObject = {};

sandbox.define(myObject, "myValue", "blackberry");

sandbox.define(myObject, "myMethod", function () {
  return "strawberry";
});

console.log(myObject.myValue);
// blackberry

console.log(myObject.myMethod());
// strawberry

sandbox.restore();

console.log(myObject.myValue);
// undefined

console.log(myObject.myMethod);
// undefined
```

_Since `sinon@15.3.0`_

#### `sandbox.replace(object, property, replacement);`

Replaces `property` on `object` with `replacement` argument. Attempts to replace an already replaced value cause an exception. Returns the `replacement`.

`replacement` can be any value, including `spies`, `stubs` and `fakes`.

This method only works on non-accessor properties, for replacing accessors, use `sandbox.replaceGetter()` and `sandbox.replaceSetter()`.

```js
const myObject = {
  myMethod: function () {
    return "apple pie";
  },
};

sandbox.replace(myObject, "myMethod", function () {
  return "strawberry";
});

console.log(myObject.myMethod());
// strawberry
```

#### `sandbox.replace.usingAccessor(object, property, value);`

Usually one intends to _replace_ the value or getter of a field, but there are use cases where one actually wants to _assign_ a value to a property using an existing setter. `#replace.usingAccessor(object, property, value)` will do just that; pass the value into setter function and vice-versa use the getter to get the value used for restoring later on.

##### Use case: no-frills dependency injection in ESM with cleanup

One use case can be to conveniently allow ESM module stubbing using pure dependency injection, having Sinon help you with the cleanup, without resorting to external machinery such as module loaders or require hooks (see [the case study on module mocking Typescript](/how-to/typescript-swc/#version-2-using-sinons-auto-cleanup) for an example). This approach works regardless of bundler, browser or server environment.

#### `sandbox.replaceGetter(object, property, replacementFunction);`

Replaces an existing getter for `property` on `object` with the `replacementFunction` argument. Attempts to replace an already replaced getter cause an exception.

`replacement` must be a `Function`, and can be instances of `spies`, `stubs` and `fakes`.

```js
const myObject = {
    get myProperty: function() {
        return 'apple pie';
    }
};

sandbox.replaceGetter(myObject, 'myProperty', function () {
    return 'strawberry';
});

console.log(myObject.myProperty);
// strawberry
```

#### `sandbox.replaceSetter(object, property, replacementFunction);`

Replaces an existing setter for `property` on `object` with the `replacementFunction` argument. Attempts to replace an already replaced setter cause an exception.

`replacement` must be a `Function`, and can be instances of `spies`, `stubs` and `fakes`.

```js
const object = {
  set myProperty(value) {
    this.prop = value;
  },
};

sandbox.replaceSetter(object, "myProperty", function (value) {
  this.prop = "strawberry " + value;
});

object.myProperty = "pie";

console.log(object.prop);
// strawberry pie
```

#### `sandbox.spy();`

Works exactly like `sinon.spy`

#### `sandbox.createStubInstance();`

Works almost exactly like `sinon.createStubInstance`, only also adds the returned stubs to the internal collection of fakes for restoring through `sandbox.restore()`.

#### `sandbox.stub();`

Works exactly like `sinon.stub`.

##### Stubbing a non-function property

```javascript
const myObject = {
  hello: "world",
};

sandbox.stub(myObject, "hello").value("Sinon");

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

#### `sandbox.usingPromise(promiseLibrary);`

Causes all stubs and mocks created from the sandbox to return promises using a specific
Promise library instead of the global one when using `stub.rejects` or
`stub.resolves`. Returns the stub to allow chaining.

_Since `sinon@2.0.0`_

#### `sandbox.restore();`

Restores all fakes created through sandbox.

#### `sandbox.reset();`

Resets the internal state of all fakes created through sandbox.

#### `sandbox.resetBehavior();`

Resets the behaviour of all stubs created through the sandbox.

_Since `sinon@2.0.0`_

#### `sandbox.resetHistory();`

Resets the history of all stubs created through the sandbox.

_Since `sinon@2.0.0`_

#### `sandbox.verify();`

Verifies all mocks created through the sandbox.

#### `sandbox.verifyAndRestore();`

Verifies all mocks and restores all fakes created through the sandbox.

#### `sandbox.leakThreshold`

Gets/sets the threshold at which memory leak detection warnings are logged.
