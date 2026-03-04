---
layout: page
title: How to stub ES module imports
---

ES Modules (ESM) are statically analyzed and their bindings are **live and immutable** by the [ECMAScript specification](https://tc39.es/ecma262/#sec-module-namespace-objects). This means that attempting to stub a named export of an ES module with Sinon will throw a `TypeError` like:

```
TypeError: ES Modules cannot be stubbed
```

This article shows how to configure Node.js to allow mutable ES module namespaces, enabling Sinon stubs to work in an ESM context.

## The problem

Consider an ES module source file and a consumer that imports from it:

### Source file: `src/math.mjs`

```javascript
export function add(a, b) {
  return a + b;
}
```

### Module under test: `src/calculator.mjs`

```javascript
import { add } from "./math.mjs";

export function calculate(a, b) {
  return add(a, b);
}
```

### Test file: `test/calculator.test.mjs`

```javascript
import sinon from "sinon";
import * as mathModule from "../src/math.mjs";
import { calculate } from "../src/calculator.mjs";

describe("calculator", () => {
  it("should use the add function", () => {
    // This will throw: TypeError: ES Modules cannot be stubbed
    sinon.stub(mathModule, "add").returns(99);
  });
});
```

Sinon correctly raises an error here because, per the ES module spec, namespace object properties are non-writable, non-configurable, and non-deletable.

## The solution: use the `esm` package with `mutableNamespace`

The [`esm`](https://github.com/standard-things/esm) package is a fast, production-ready ES module loader for Node.js. It offers a `mutableNamespace` option that makes module namespace objects writable, which is what Sinon needs to install stubs.

### Step 1: Install the `esm` package

```bash
npm install --save-dev esm
```

### Step 2: Create a loader / setup file

Create a file at the root of your project (e.g., `esm-loader.cjs`) that enables the `mutableNamespace` option:

```javascript
// esm-loader.cjs
require = require("esm")(module, {
  cjs: true,
  mutableNamespace: true,
});
```

> **Note:** The `.cjs` extension (or `"type": "module"` absent in `package.json`) ensures this file is treated as CommonJS, which is required to call `require('esm')`.

### Step 3: Register the loader when running tests

Update your `package.json` test script to use `--require` to load the setup file before your test runner:

```json
{
  "scripts": {
    "test": "mocha --require ./esm-loader.cjs 'test/**/*.test.mjs'"
  }
}
```

### Step 4: Write the test

Now your test can use `sinon.stub()` normally against ES module exports:

```javascript
// test/calculator.test.mjs
import sinon from "sinon";
import * as mathModule from "../src/math.mjs";
import { calculate } from "../src/calculator.mjs";
import assert from "assert";

describe("calculator", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should delegate to the add function", () => {
    sinon.stub(mathModule, "add").returns(99);

    const result = calculate(1, 2);

    assert.equal(result, 99);
    assert.ok(mathModule.add.calledOnce);
  });
});
```

## Complete example: project layout

```
.
├── src
│   ├── math.mjs
│   └── calculator.mjs
├── test
│   └── calculator.test.mjs
├── esm-loader.cjs
└── package.json
```

### `package.json`

```json
{
  "name": "esm-sinon-example",
  "version": "1.0.0",
  "scripts": {
    "test": "mocha --require ./esm-loader.cjs 'test/**/*.test.mjs'"
  },
  "devDependencies": {
    "esm": "^3.2.25",
    "mocha": "^10.0.0",
    "sinon": "*"
  }
}
```

### `esm-loader.cjs`

```javascript
require = require("esm")(module, {
  cjs: true,
  mutableNamespace: true,
});
```

### `src/math.mjs`

```javascript
export function add(a, b) {
  return a + b;
}
```

### `src/calculator.mjs`

```javascript
import { add } from "./math.mjs";

export function calculate(a, b) {
  return add(a, b);
}
```

### `test/calculator.test.mjs`

```javascript
import sinon from "sinon";
import * as mathModule from "../src/math.mjs";
import { calculate } from "../src/calculator.mjs";
import assert from "assert";

describe("calculator", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should use stubbed add function", () => {
    sinon.stub(mathModule, "add").returns(42);

    const result = calculate(10, 20);

    assert.equal(result, 42);
    assert.ok(mathModule.add.calledOnceWith(10, 20));
  });

  it("should call the real add function when not stubbed", () => {
    const result = calculate(3, 4);

    assert.equal(result, 7);
  });
});
```

## Why does this work?

The `esm` package hooks into Node.js's module loading system. When `mutableNamespace: true` is set, it wraps ES module namespace objects with a `Proxy` that allows property assignment. Sinon's `stub()` function replaces the property on the namespace object; with the proxy in place, this assignment succeeds instead of throwing.

## Limitations and caveats

- **Only works with the `esm` package.** Native `--experimental-vm-modules` or other loaders do not support `mutableNamespace` out of the box.
- **Transpiled output**: If you are using TypeScript or Babel that already compiles your ESM to CommonJS, this approach is not needed. [Stub the CommonJS dependency][stub-dependency] instead.
- **Destructured imports cannot be stubbed.** If the module under test does `import { add } from './math.mjs'` and uses `add` as a local binding, the stub on the namespace will **not** affect the already-captured binding. The consumer must access the export through the module namespace object for stubs to take effect.
- **`mutableNamespace` is non-standard.** It deviates from the ESM specification. Consider it a testing convenience rather than a production technique.

## Related articles

- [How to stub a dependency of a module (CommonJS)][stub-dependency]
- [How to stub out CommonJS modules using link seams][link-seams]
- [Real world dependency stubbing][typescript-swc-stub] (using Typescript and SWC)

[stub-dependency]: /how-to/stub-dependency/
[link-seams]: /how-to/link-seams-commonjs/
[typescript-swc-stub]: /how-to/typescript-swc/
