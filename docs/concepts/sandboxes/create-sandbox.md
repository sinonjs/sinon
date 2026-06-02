---
title: sinon.createSandbox
description: Creates a sandbox for grouping fakes, spies, and stubs with automatic cleanup. Use only for advanced scenarios.
---

**⚠️ WARNING ⚠️**

**Unless you have very advanced scenarios, you will not need to use `createSandbox` and should use the [default sandbox](/concepts/sandboxes/#default-sandbox) on the `sinon` object itself.**

---

# `var sandbox = sinon.createSandbox();`

Creates a new sandbox object with spies, stubs, and mocks.

# `sinon.createSandbox(config)`

Creates a new sandbox object with it's own set of spies, stubs, and mocks.

The `createSandbox` method is mostly an integration feature, and can be used for advanced scenarios including a global object to coordinate all fakes through.

Sandboxes are partially configured by default such that calling:

<<< @/.vitepress/tests/docs/sandboxes/create-sandbox-1.test.js

will merge in extra defaults analogous to:

<<< @/.vitepress/tests/docs/sandboxes/create-sandbox-2.test.js

`useFakeTimers` is **false** by default in `createSandbox`, unlike the default sandbox where fake timers are enabled:

To get a full sandbox with stubs, spies, etc. **and** fake timers, you can call:

<<< @/.vitepress/tests/docs/sandboxes/create-sandbox-4.test.js

### `injectInto`

The sandbox's methods can be injected into another object for convenience. The
`injectInto` configuration option can name an object to add properties to.

### `properties`

The list of properties that can be injected are the ones exposed by the object
returned by the function `inject`, namely:

<<< @/.vitepress/tests/docs/sandboxes/create-sandbox-5.test.js

### `useFakeTimers`

If set to `true`, the sandbox will have a `clock` property. You can optionally pass
in a configuration object that follows the [specification for fake timers](/concepts/fake-timers/),
such as `{ toFake: ["setTimeout", "setInterval"] }`.

### exposing sandbox example

To create an object `sandboxFacade` which gets the method `spy` injected, you
can code:

<<< @/.vitepress/tests/docs/sandboxes/create-sandbox-6.test.js
