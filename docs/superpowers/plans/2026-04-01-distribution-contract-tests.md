# Distribution Contract Tests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add artifact-first integration tests that verify Sinon’s published Node and browser APIs stay compatible while the repo migrates to ESM-authored source.

**Architecture:** Build the package, pack it as npm would publish it, install that tarball into temporary fixture projects, and run consumer-style scripts against the installed package. Protect browser/CDN consumers separately by executing smoke tests against the generated `pkg/` files. Check a checked-in public API manifest to catch shape drift early, and use behavioral tests to catch export interop and synchronous API regressions.

**Tech Stack:** Node.js, Mocha, Puppeteer, npm pack, temporary fixture directories via `fs.mkdtempSync`, built Sinon artifacts from `pkg/`

---

### Task 1: Add A Distribution Test Harness

**Files:**
- Create: `scripts/test-distribution.mjs`
- Create: `test/distribution/helpers/run-fixture.mjs`
- Modify: `package.json`
- Test: `test/distribution/**/*`

- [ ] **Step 1: Add the test harness entry script**

Create `scripts/test-distribution.mjs` to:
- run `npm run build`
- run `npm pack --json`
- parse the generated tarball filename
- create a temporary root under `os.tmpdir()`
- execute fixture projects one by one
- print a compact pass/fail summary and exit non-zero on the first failure

Use a structure like:

```js
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(command, args, cwd) {
    execFileSync(command, args, {
        cwd,
        stdio: "inherit",
        env: process.env,
    });
}

run("npm", ["run", "build"], repoRoot);
const packJson = execFileSync("npm", ["pack", "--json"], { cwd: repoRoot });
const [{ filename }] = JSON.parse(packJson.toString("utf8"));
```

- [ ] **Step 2: Add a reusable fixture runner**

Create `test/distribution/helpers/run-fixture.mjs` to:
- create a temp directory for one fixture
- copy the fixture files in
- write a minimal `package.json` if the fixture does not include one
- run `npm install --no-package-lock --no-save <path-to-tarball>`
- execute the fixture entrypoint with `node`

Use a helper signature like:

```js
export async function runFixture({
    fixtureDir,
    tarballPath,
    entryFile,
    nodeArgs = [],
}) {}
```

- [ ] **Step 3: Wire the harness into package scripts**

Modify `package.json` to add:

```json
{
  "scripts": {
    "test-distribution": "node ./scripts/test-distribution.mjs"
  }
}
```

Also update the main `test` flow later, but keep this script independently runnable first.

- [ ] **Step 4: Verify the harness fails meaningfully before fixtures exist**

Run: `npm run test-distribution`

Expected:
- build completes
- pack completes
- script fails with a clear “no fixtures found” or equivalent explicit error

- [ ] **Step 5: Commit**

```bash
git add package.json scripts/test-distribution.mjs test/distribution/helpers/run-fixture.mjs
git commit -m "test: add distribution harness"
```

### Task 2: Add Node Consumer Contract Fixtures

**Files:**
- Create: `test/distribution/fixtures/require-default/index.cjs`
- Create: `test/distribution/fixtures/require-default/package.json`
- Create: `test/distribution/fixtures/import-default/index.mjs`
- Create: `test/distribution/fixtures/import-default/package.json`
- Create: `test/distribution/fixtures/import-named/index.mjs`
- Create: `test/distribution/fixtures/import-named/package.json`
- Create: `test/distribution/fixtures/require-package-exports/index.cjs`
- Create: `test/distribution/fixtures/require-package-exports/package.json`
- Modify: `scripts/test-distribution.mjs`
- Test: `scripts/test-distribution.mjs`

- [ ] **Step 1: Add a CommonJS default-consumer fixture**

Create `test/distribution/fixtures/require-default/index.cjs`:

```js
"use strict";

const assert = require("node:assert/strict");
const sinon = require("sinon");

assert.equal(typeof sinon, "object");
assert.equal(typeof sinon.spy, "function");
assert.equal(typeof sinon.stub, "function");
assert.equal(typeof sinon.fake, "function");
assert.equal(typeof sinon.createSandbox, "function");
assert.equal(typeof sinon.restore, "function");
assert.equal(typeof sinon.match, "function");
assert.equal(typeof sinon.promise, "object");
assert.equal(typeof sinon.timers, "object");
assert.equal(sinon.createSandbox.length, 1);
assert.equal(sinon.createSandbox.name, "createSandbox");

const spy = sinon.spy();
spy("a");
assert.equal(spy.callCount, 1);

const stub = sinon.stub().returns(42);
assert.equal(stub(), 42);

const sandbox = sinon.createSandbox();
const clock = sandbox.useFakeTimers();
assert.equal(typeof clock.tick, "function");
assert.equal(typeof clock.restore, "function");
clock.restore();
sandbox.restore();
```

- [ ] **Step 2: Add an ESM default-import fixture**

Create `test/distribution/fixtures/import-default/index.mjs`:

```js
import assert from "node:assert/strict";
import sinon from "sinon";

assert.equal(typeof sinon, "object");
assert.equal(typeof sinon.spy, "function");
assert.equal(typeof sinon.stub, "function");
assert.equal(typeof sinon.createSandbox, "function");

const spy = sinon.spy();
spy();
assert.equal(spy.callCount, 1);
```

- [ ] **Step 3: Add an ESM named-import fixture**

Create `test/distribution/fixtures/import-named/index.mjs`:

```js
import assert from "node:assert/strict";
import sinon, { createSandbox, spy, stub, match } from "sinon";

assert.equal(typeof sinon, "object");
assert.equal(typeof createSandbox, "function");
assert.equal(typeof spy, "function");
assert.equal(typeof stub, "function");
assert.equal(typeof match, "function");

const sandbox = createSandbox();
const fn = stub().returns("ok");
assert.equal(fn(), "ok");
sandbox.restore();
```

- [ ] **Step 4: Add a package-exports CJS fixture**

Create `test/distribution/fixtures/require-package-exports/index.cjs`:

```js
"use strict";

const assert = require("node:assert/strict");
const sinon = require("sinon");

assert.equal(typeof sinon.restoreObject, "function");
assert.equal(typeof sinon.expectation, "object");
assert.equal(Object.prototype.hasOwnProperty.call(sinon, "timers"), true);
assert.equal(Object.prototype.hasOwnProperty.call(sinon, "promise"), true);
```

This fixture is not about deep internals. It is about the published root export object.

- [ ] **Step 5: Register all fixtures in the harness**

Modify `scripts/test-distribution.mjs` so it runs:
- `require-default/index.cjs`
- `import-default/index.mjs`
- `import-named/index.mjs`
- `require-package-exports/index.cjs`

Print one line per fixture:

```txt
PASS require-default
PASS import-default
PASS import-named
PASS require-package-exports
```

- [ ] **Step 6: Run the distribution suite**

Run: `npm run test-distribution`

Expected:
- all four fixtures pass against the packed tarball
- no fixture references `../lib` or repo-local paths

- [ ] **Step 7: Commit**

```bash
git add scripts/test-distribution.mjs test/distribution/fixtures
git commit -m "test: verify packed cjs and esm entrypoints"
```

### Task 3: Add A Public API Manifest Check

**Files:**
- Create: `test/distribution/public-api-manifest.json`
- Create: `test/distribution/helpers/read-public-api.cjs`
- Modify: `test/distribution/fixtures/require-default/index.cjs`
- Modify: `scripts/test-distribution.mjs`
- Test: `test/distribution/public-api-manifest.json`

- [ ] **Step 1: Add a manifest extractor**

Create `test/distribution/helpers/read-public-api.cjs`:

```js
"use strict";

const sinon = require("sinon");

function describeFunction(fn) {
    return {
        type: typeof fn,
        length: fn.length,
        name: fn.name,
    };
}

module.exports = {
    topLevelKeys: Object.keys(sinon).sort(),
    functions: {
        createSandbox: describeFunction(sinon.createSandbox),
        spy: describeFunction(sinon.spy),
        stub: describeFunction(sinon.stub),
        fake: describeFunction(sinon.fake),
        restore: describeFunction(sinon.restore),
    },
    hasTimers: Object.prototype.hasOwnProperty.call(sinon, "timers"),
    hasPromise: Object.prototype.hasOwnProperty.call(sinon, "promise"),
    hasMatch: Object.prototype.hasOwnProperty.call(sinon, "match"),
};
```

- [ ] **Step 2: Generate and check in the first manifest from the current known-good build**

Create `test/distribution/public-api-manifest.json` from the current release line.

This file should contain:
- sorted top-level keys
- `type`, `length`, and `name` for selected functions
- booleans for `timers`, `promise`, and `match`

Do not include unstable values like full object dumps or function source strings.

- [ ] **Step 3: Compare current packed output against the manifest**

Modify `scripts/test-distribution.mjs` to:
- run the extractor inside the temporary installed package
- compare it to `test/distribution/public-api-manifest.json`
- print a readable diff on mismatch

Use a focused error like:

```txt
Public API manifest mismatch:
- missing key: timers
- createSandbox.length expected 1, got 0
```

- [ ] **Step 4: Keep behavior assertions alongside the manifest**

Do not let the manifest replace behavioral checks. Leave:
- `sinon.stub().returns(42)`
- `sinon.spy().callCount`
- `sandbox.useFakeTimers()` sync clock creation

This catches interop bugs that a key snapshot will miss.

- [ ] **Step 5: Run the suite and verify manifest stability**

Run: `npm run test-distribution`

Expected:
- manifest check passes
- behavior checks still pass

- [ ] **Step 6: Commit**

```bash
git add test/distribution/public-api-manifest.json test/distribution/helpers/read-public-api.cjs scripts/test-distribution.mjs
git commit -m "test: lock distribution api manifest"
```

### Task 4: Expand Built Artifact Smoke Tests For `pkg/`

**Files:**
- Create: `test/distribution/browser-global-smoke.js`
- Modify: `test/es2015/check-esm-bundle-is-runnable.js`
- Modify: `package.json`
- Test: `pkg/sinon.js`
- Test: `pkg/sinon-esm.js`

- [ ] **Step 1: Keep the existing module smoke test, but make its intent explicit**

Modify `test/es2015/check-esm-bundle-is-runnable.js` so it asserts:
- default import from `/sinon-esm.js` works
- named import from `/sinon-esm.js` works
- `sinon.stub`, `spy`, and `createSandbox` are callable in a browser module context

Add one extra assertion:

```js
const sandbox = createSandbox();
const fake = sandbox.stub().returns(7);
assert(7 === fake());
sandbox.restore();
```

- [ ] **Step 2: Add a classic-browser global smoke test**

Create `test/distribution/browser-global-smoke.js` to:
- serve `pkg/sinon.js`
- open a page with Puppeteer
- load it via `<script src="/sinon.js"></script>`
- assert `window.sinon` exists
- assert `window.sinon.spy`, `window.sinon.stub`, and `window.sinon.createSandbox` work

Core browser assertions:

```js
assert(typeof window.sinon === "object");
assert(typeof window.sinon.stub === "function");
const stub = window.sinon.stub().returns(10);
assert(stub() === 10);
```

- [ ] **Step 3: Add npm scripts for bundle smoke tests**

Modify `package.json` to add:

```json
{
  "scripts": {
    "test-pkg-browser-global": "node test/distribution/browser-global-smoke.js",
    "test-pkg-browser-esm": "node test/es2015/check-esm-bundle-is-runnable.js"
  }
}
```

- [ ] **Step 4: Run the two browser artifact checks**

Run:
- `npm run test-pkg-browser-esm`
- `npm run test-pkg-browser-global`

Expected:
- both pass using only files from `pkg/`

- [ ] **Step 5: Commit**

```bash
git add test/distribution/browser-global-smoke.js test/es2015/check-esm-bundle-is-runnable.js package.json
git commit -m "test: smoke test built pkg artifacts"
```

### Task 5: Gate The Main Test Flow On Artifact Contracts

**Files:**
- Modify: `package.json`
- Modify: `CONTRIBUTING.md`
- Modify: `README.md`
- Test: CI-equivalent local script sequence

- [ ] **Step 1: Add the new checks to the normal verification flow**

Modify `package.json` so the relevant scripts become:

```json
{
  "scripts": {
    "test-contract": "npm run test-distribution && npm run test-pkg-browser-esm && npm run test-pkg-browser-global",
    "postbuild": "npm run test-esm-support && npm run test-esm-browser-build && npm run test-contract"
  }
}
```

If runtime cost is too high, keep `test-contract` separate from `test`, but require it before any migration PR merges.

- [ ] **Step 2: Document what these tests protect**

Update `CONTRIBUTING.md` and `README.md` with a short note:
- `test-distribution` validates the packed npm artifact for CJS and ESM consumers
- `test-pkg-browser-esm` validates `pkg/sinon-esm.js`
- `test-pkg-browser-global` validates `pkg/sinon.js`

- [ ] **Step 3: Define the migration rule**

Document this in contributor docs and PR guidance:
- source-layout refactors may proceed only if `test-contract` stays green
- any intentional API change must update the manifest in the same PR with explicit reviewer sign-off

- [ ] **Step 4: Run the full contract sequence**

Run:

```bash
npm run build
npm run test-distribution
npm run test-pkg-browser-esm
npm run test-pkg-browser-global
```

Expected:
- all artifact-contract checks pass from the current codebase before any ESM-source migration begins

- [ ] **Step 5: Commit**

```bash
git add package.json CONTRIBUTING.md README.md
git commit -m "docs: require contract tests for package migration"
```

### Task 6: Add Focused Regression Fixtures For Known ESM Migration Risks

**Files:**
- Create: `test/distribution/fixtures/require-fake-timers-sync/index.cjs`
- Create: `test/distribution/fixtures/import-default-and-named/index.mjs`
- Modify: `scripts/test-distribution.mjs`
- Modify: `test/es2015/check-esm-bundle-is-runnable.js`

- [ ] **Step 1: Add a fake-timers sync contract fixture**

Create `test/distribution/fixtures/require-fake-timers-sync/index.cjs`:

```js
"use strict";

const assert = require("node:assert/strict");
const sinon = require("sinon");

const sandbox = sinon.createSandbox();
const clock = sandbox.useFakeTimers();

assert.equal(typeof clock, "object");
assert.equal(typeof clock.tick, "function");
assert.equal(typeof clock.restore, "function");

clock.tick(5);
clock.restore();
sandbox.restore();
```

This fixture exists specifically to catch accidental async loading in the CJS path.

- [ ] **Step 2: Add a mixed ESM import fixture**

Create `test/distribution/fixtures/import-default-and-named/index.mjs`:

```js
import assert from "node:assert/strict";
import sinon, { spy, stub, createSandbox } from "sinon";

assert.equal(sinon.spy, spy);
assert.equal(sinon.stub, stub);
assert.equal(typeof createSandbox, "function");
```

This catches export-shape mistakes from bundler interop.

- [ ] **Step 3: Register the regression fixtures in the distribution harness**

Update the fixture list in `scripts/test-distribution.mjs` to include:
- `require-fake-timers-sync`
- `import-default-and-named`

- [ ] **Step 4: Strengthen the browser ESM smoke test against named export regressions**

Update `test/es2015/check-esm-bundle-is-runnable.js` to import:

```js
import sinon, { spy, stub, createSandbox } from "/sinon-esm.js";
```

Then assert all of those work in the browser page.

- [ ] **Step 5: Run the full contract suite**

Run: `npm run test-contract`

Expected:
- CJS consumers still get synchronous fake timers
- ESM default and named exports still agree
- browser `pkg/` ESM still supports both import styles

- [ ] **Step 6: Commit**

```bash
git add scripts/test-distribution.mjs test/distribution/fixtures test/es2015/check-esm-bundle-is-runnable.js
git commit -m "test: guard esm migration regressions"
```

## Execution Notes

- Keep all distribution fixtures consumer-shaped. They must import `sinon` by package name after installing the packed tarball, never by relative path into the repo.
- Prefer `npm pack` over direct file execution. The tarball is the published contract.
- Keep the manifest intentionally small and stable. Use behavioral checks for semantics.
- Land this entire safeguard layer before moving source files from `lib/` to `src/`.
- The first ESM-migration PR should be blocked on `npm run test-contract`.

## Suggested Initial Assertion Matrix

- `require("sinon")` returns an object
- `import sinon from "sinon"` returns an object
- `import { spy, stub, createSandbox, match } from "sinon"` works
- `sinon.createSandbox.length === 1`
- `sinon.createSandbox.name === "createSandbox"`
- `typeof sinon.restoreObject === "function"`
- `typeof sinon.expectation === "object"`
- `typeof sinon.timers === "object"`
- `typeof sinon.promise === "object"`
- `sinon.stub().returns(42)()` returns `42`
- `sinon.spy()` records calls
- `sandbox.useFakeTimers()` returns a clock synchronously
- `pkg/sinon-esm.js` supports default and named imports in browser module code
- `pkg/sinon.js` defines `window.sinon` and supports basic spy/stub/sandbox flows
