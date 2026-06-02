---
url: /concepts/sandboxes/create-sandbox.md
description: >-
  Creates a sandbox for grouping fakes, spies, and stubs with automatic cleanup.
  Use only for advanced scenarios.
---

**⚠️ WARNING ⚠️**

**Unless you have very advanced scenarios, you will not need to use `createSandbox` and should use the [default sandbox](/concepts/sandboxes/#default-sandbox) on the `sinon` object itself.**

***

# `var sandbox = sinon.createSandbox();`

Creates a new sandbox object with spies, stubs, and mocks.

# `sinon.createSandbox(config)`

Creates a new sandbox object with it's own set of spies, stubs, and mocks.

The `createSandbox` method is mostly an integration feature, and can be used for advanced scenarios including a global object to coordinate all fakes through.

Sandboxes are partially configured by default such that calling:

```js
import t from "tap";
import sinon from "sinon";

t.test("createSandbox with empty config uses defaults", (t) => {
  const sandbox = sinon.createSandbox({});

  // Verify sandbox has expected methods
  t.ok(sandbox.spy, "sandbox should have spy method");
  t.ok(sandbox.stub, "sandbox should have stub method");
  t.ok(sandbox.mock, "sandbox should have mock method");

  // Verify useFakeTimers is false by default
  t.notOk(sandbox.clock, "sandbox should not have clock by default");

  sandbox.restore();
  t.end();
});

```

will merge in extra defaults analogous to:

```js
import t from "tap";
import sinon from "sinon";

t.test("createSandbox merges in default configuration", (t) => {
  const sandbox = sinon.createSandbox({
    injectInto: null,
    properties: ["spy", "stub", "mock"],
    useFakeTimers: false
  });

  // Verify the configuration is applied
  t.ok(sandbox.spy, "sandbox should have spy");
  t.ok(sandbox.stub, "sandbox should have stub");
  t.ok(sandbox.mock, "sandbox should have mock");
  t.notOk(
    sandbox.clock,
    "sandbox should not have clock when useFakeTimers is false"
  );

  sandbox.restore();
  t.end();
});

```

`useFakeTimers` is **false** by default in `createSandbox`, unlike the default sandbox where fake timers are enabled:

To get a full sandbox with stubs, spies, etc. **and** fake timers, you can call:

```js
import t from "tap";
import sinon from "sinon";

t.test("createSandbox with useFakeTimers creates clock", (t) => {
  // Create sandbox with useFakeTimers explicitly
  const sandbox = sinon.createSandbox({
    useFakeTimers: true
  });

  t.ok(sandbox.clock, "sandbox with useFakeTimers:true should have clock");
  t.ok(sandbox.clock.tick, "clock should have tick method");

  sandbox.restore();

  t.end();
});

```

### `injectInto`

The sandbox's methods can be injected into another object for convenience. The
`injectInto` configuration option can name an object to add properties to.

### `properties`

The list of properties that can be injected are the ones exposed by the object
returned by the function `inject`, namely:

```js
import t from "tap";
import sinon from "sinon";

t.test("createSandbox available properties list", (t) => {
  const availableProperties = [
    "spy",
    "stub",
    "mock",
    "createStubInstance",
    "fake",
    "replace",
    "replaceSetter",
    "replaceGetter",
    "clock",
    "match"
  ];

  // Create sandbox with all properties
  const sandbox = sinon.createSandbox({
    properties: availableProperties,
    useFakeTimers: true
  });

  // Verify key properties exist
  t.ok(sandbox.spy, "sandbox should have spy");
  t.ok(sandbox.stub, "sandbox should have stub");
  t.ok(sandbox.mock, "sandbox should have mock");
  t.ok(sandbox.fake, "sandbox should have fake");
  t.ok(sandbox.clock, "sandbox should have clock");

  sandbox.restore();
  t.end();
});

```

### `useFakeTimers`

If set to `true`, the sandbox will have a `clock` property. You can optionally pass
in a configuration object that follows the [specification for fake timers](/concepts/fake-timers/),
such as `{ toFake: ["setTimeout", "setInterval"] }`.

### exposing sandbox example

To create an object `sandboxFacade` which gets the method `spy` injected, you
can code:

```js
import t from "tap";
import sinon from "sinon";

t.test("createSandbox with injectInto injects methods into object", (t) => {
  // Object that will have the spy method injected into it
  const sandboxFacade = {};

  // Create sandbox and inject properties (in this case spy) into sandboxFacade
  const sandbox = sinon.createSandbox({
    injectInto: sandboxFacade,
    properties: ["spy"]
  });

  // Verify spy method was injected
  t.ok(sandboxFacade.spy, "sandboxFacade should have spy method");
  t.type(sandboxFacade.spy, "function", "spy should be a function");

  // Verify the injected method works
  const obj = { method: function () {} };
  sandboxFacade.spy(obj, "method");
  obj.method();
  t.ok(obj.method.calledOnce, "injected spy should track calls");

  sandbox.restore();
  t.end();
});

```
