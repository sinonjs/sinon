# Initial ESM Source Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move Sinon’s authored library source from CommonJS in `lib/` to ESM JavaScript in `src/`, while preserving the published CJS API, ESM API, and browser bundle behavior for consumers.

**Architecture:** Treat the new distribution contract suite as the release gate, then introduce an ESM-authored `src/` tree and a build step that generates the published CommonJS compatibility tree in `lib/`. Keep the external package shape stable: `require("sinon")` stays synchronous and object-shaped, `import sinon from "sinon"` keeps working, named ESM imports keep working, and browser consumers continue to use `pkg/sinon.js` and `pkg/sinon-esm.js`.

**Tech Stack:** Node.js, Rollup, existing esbuild-based browser bundle flow or a Rollup replacement, ESM JavaScript with JSDoc, npm pack contract tests, Puppeteer smoke tests

---

## Prerequisite

This plan assumes [2026-04-01-distribution-contract-tests.md](/Users/carlerik/dev/sinon/docs/superpowers/plans/2026-04-01-distribution-contract-tests.md) is fully implemented first and that `npm run test-contract` exists and is green on the current baseline.

---

### Task 1: Freeze The External Contract Before Source Migration

**Files:**
- Modify: `package.json`
- Modify: `README.md`
- Modify: `CONTRIBUTING.md`
- Test: `test/distribution/**/*`
- Test: `test/es2015/check-esm-bundle-is-runnable.js`

- [ ] **Step 1: Verify the contract suite is the required migration gate**

Run:

```bash
npm run test-contract
```

Expected:
- packed tarball CJS fixtures pass
- packed tarball ESM fixtures pass
- `pkg/sinon-esm.js` browser module smoke test passes
- `pkg/sinon.js` browser global smoke test passes

- [ ] **Step 2: Add a dedicated migration verification script if one does not exist**

Modify `package.json` to add:

```json
{
  "scripts": {
    "verify-esm-migration": "npm run lint && npm run test-contract && npm run test-node"
  }
}
```

Keep `test-contract` as the minimum hard gate. `verify-esm-migration` is the full local pre-merge gate for this refactor.

- [ ] **Step 3: Document the migration rule**

Update `README.md` and `CONTRIBUTING.md` with a short rule:
- source format and build-system changes are allowed only when `npm run test-contract` remains green
- any intentional top-level export change requires updating the checked-in distribution manifest in the same PR with explicit reviewer sign-off

- [ ] **Step 4: Commit**

```bash
git add package.json README.md CONTRIBUTING.md
git commit -m "docs: require contract gate for esm migration"
```

### Task 2: Introduce An ESM Authoring Tree And Generated `lib/`

**Files:**
- Create: `src/sinon.js`
- Create: `src/sinon-esm.js`
- Create: `src/create-sinon-api.js`
- Create: `rollup.config.mjs`
- Modify: `build.cjs`
- Modify: `package.json`
- Modify: `lib/package.json`
- Test: `npm run build`
- Test: `npm run test-contract`

- [ ] **Step 1: Add the first ESM entry modules in `src/`**

Create `src/sinon.js`:

```js
import createApi from "./create-sinon-api.js";

const sinon = createApi();

export default sinon;
```

Create `src/sinon-esm.js`:

```js
export { default } from "./sinon.js";
export * from "./sinon.js";
```

Create `src/create-sinon-api.js` as an ESM equivalent of the current root API builder. During the first pass, it may temporarily import legacy internals, but it must itself be authored as ESM and export a default function.

- [ ] **Step 2: Add a Rollup build that generates the CommonJS `lib/` tree from `src/`**

Create `rollup.config.mjs` with:
- input entries:
  - `src/sinon.js`
  - `src/sinon-esm.js`
  - `src/create-sinon-api.js`
- output:
  - directory `lib/`
  - `format: "cjs"`
  - `preserveModules: true`
  - `preserveModulesRoot: "src"`

Use plugins:
- `@rollup/plugin-node-resolve`
- `@rollup/plugin-commonjs`
- `@rollup/plugin-json`

Do not mark ESM-only runtime dependencies as external in the generated `lib/` build. They must be compiled into the compatibility output or transformed into compatible chunks.

- [ ] **Step 3: Keep `lib/package.json` as the CommonJS boundary**

Ensure `lib/package.json` still contains:

```json
{
  "type": "commonjs"
}
```

This preserves CJS semantics for the generated `lib/**/*.js` files even though the package root stays `"type": "module"`.

- [ ] **Step 4: Update the build orchestration to generate `lib/` before bundling `pkg/`**

Modify `build.cjs` so it:
- runs Rollup first to generate `lib/`
- only then loads `./lib/sinon`
- then generates:
  - `pkg/sinon.js`
  - `pkg/sinon-no-sourcemaps.cjs`
  - `pkg/sinon-esm.js`

Important: remove the current top-level `require("./lib/sinon")` from `build.cjs` and defer it until after the generated `lib/` exists.

- [ ] **Step 5: Update scripts and dev dependencies**

Modify `package.json` to add:
- `rollup`
- `@rollup/plugin-node-resolve`
- `@rollup/plugin-commonjs`
- `@rollup/plugin-json`

Keep the public `exports`, `main`, `module`, `browser`, `cdn`, and `jsdelivr` fields unchanged in this task.

- [ ] **Step 6: Run the first dual-build verification**

Run:

```bash
npm run build
npm run test-contract
```

Expected:
- build succeeds with `src/` as the source input for the generated `lib/`
- contract suite stays green

- [ ] **Step 7: Commit**

```bash
git add src/sinon.js src/sinon-esm.js src/create-sinon-api.js rollup.config.mjs build.cjs package.json lib/package.json
git commit -m "build: generate cjs lib from esm source entries"
```

### Task 3: Migrate The Root API Surface To ESM Source

**Files:**
- Modify: `src/create-sinon-api.js`
- Create: `src/sinon/sandbox.js`
- Create: `src/sinon/create-sandbox.js`
- Create: `src/sinon/promise.js`
- Create: `src/sinon/util/fake-timers.js`
- Create: `src/sinon/restore-object.js`
- Create: `src/sinon/mock-expectation.js`
- Create: `src/sinon/behavior.js`
- Create: `src/sinon/stub.js`
- Create: `src/sinon/util/core/extend.js`
- Test: `test/sinon-test.js`
- Test: `test/create-sandbox-test.js`
- Test: `test/util/fake-timers-test.js`
- Test: `npm run test-contract`

- [ ] **Step 1: Convert `create-sinon-api` dependencies that define the top-level package shape**

Port the modules that directly shape the root export object to ESM-authored files under `src/`:
- `create-sinon-api`
- `sandbox`
- `create-sandbox`
- `promise`
- `restore-object`
- `mock-expectation`
- `behavior`
- `stub`
- `util/fake-timers`
- `util/core/extend`

Use these conversion rules:
- `const x = require("./y")` → `import x from "./y.js"`
- `const z = require("pkg").name` → `import { name as z } from "pkg"` when the package supports named ESM imports reliably, otherwise import the package namespace and destructure
- `module.exports = fn` → `export default fn`
- `exports.name = value` → `export { value as name }`

- [ ] **Step 2: Preserve the root API object shape exactly**

Ensure `src/create-sinon-api.js` still exposes the same top-level shape as the current implementation:
- `createSandbox`
- `match`
- `restoreObject`
- `expectation`
- `timers`
- `addBehavior`
- `promise`

Keep `createApi()` returning the configured sandbox object and do not make any exported APIs async.

- [ ] **Step 3: Add JSDoc while converting touched modules**

Do not change the package to TypeScript. Add or preserve JSDoc on:
- exported factory functions
- the `useFakeTimers` config argument
- root API builder return values

This is a migration hygiene step, not a full typing pass.

- [ ] **Step 4: Run focused regression tests after the root-surface conversion**

Run:

```bash
npm run test-node -- test/sinon-test.js test/create-sandbox-test.js test/util/fake-timers-test.js
npm run test-contract
```

Expected:
- root export tests pass
- fake-timers stays synchronous for CJS consumers
- packed tarball and browser artifacts still pass

- [ ] **Step 5: Commit**

```bash
git add src/create-sinon-api.js src/sinon src/sinon/util
git commit -m "refactor: migrate root api surface to esm source"
```

### Task 4: Migrate The Utility And Proxy Cluster To ESM

**Files:**
- Create: `src/sinon/colorizer.js`
- Create: `src/sinon/spy-formatters.js`
- Create: `src/sinon/proxy.js`
- Create: `src/sinon/proxy-call.js`
- Create: `src/sinon/proxy-call-util.js`
- Create: `src/sinon/proxy-invoke.js`
- Create: `src/sinon/spy.js`
- Create: `src/sinon/fake.js`
- Create: `src/sinon/assert.js`
- Create: `src/sinon/collect-own-methods.js`
- Create: `src/sinon/create-stub-instance.js`
- Create: `src/sinon/throw-on-falsy-object.js`
- Create: `src/sinon/util/core/*.js` for any remaining utility dependencies in this cluster
- Test: `test/spy-test.js`
- Test: `test/stub-test.js`
- Test: `test/assert-test.js`
- Test: `test/spy-formatters-test.js`
- Test: `npm run test-contract`

- [ ] **Step 1: Port the proxy and assertion path to ESM-authored source**

Convert the modules that power common user workflows:
- `proxy`
- `proxy-call`
- `proxy-call-util`
- `proxy-invoke`
- `spy`
- `fake`
- `assert`
- `spy-formatters`
- `colorizer`

Also port utility dependencies used only by this cluster.

- [ ] **Step 2: Normalize import style for CommonJS dependencies**

For packages like `diff`, `util`, and `@sinonjs/commons`, prefer a stable import form that works in authoring and bundling:

```js
import util from "node:util";
const { inspect } = util;
```

or:

```js
import * as commons from "@sinonjs/commons";
const arrayProto = commons.prototypes.array;
```

Be consistent within a module instead of mixing styles.

- [ ] **Step 3: Run focused behavior tests**

Run:

```bash
npm run test-node -- test/spy-test.js test/stub-test.js test/assert-test.js test/spy-formatters-test.js
npm run test-contract
```

Expected:
- common spy/stub/assert behavior stays unchanged
- distribution contract stays green

- [ ] **Step 4: Commit**

```bash
git add src/sinon
git commit -m "refactor: migrate proxy and assertion cluster to esm source"
```

### Task 5: Migrate The Mock And Sandbox Support Cluster To ESM

**Files:**
- Create: `src/sinon/mock.js`
- Create: `src/sinon/default-behaviors.js`
- Create: `src/sinon/util/core/export-async-behaviors.js`
- Create: `src/sinon/util/core/next-tick.js`
- Create: `src/sinon/util/core/get-next-tick.js`
- Create: `src/sinon/util/core/walk.js`
- Create: `src/sinon/util/core/walk-object.js`
- Create: `src/sinon/util/core/get-property-descriptor.js`
- Create: `src/sinon/util/core/is-property-configurable.js`
- Create: `src/sinon/util/core/is-non-existent-property.js`
- Create: `src/sinon/util/core/is-es-module.js`
- Create: `src/sinon/util/core/is-restorable.js`
- Create: `src/sinon/util/core/function-to-string.js`
- Create: `src/sinon/util/core/times-in-words.js`
- Create: `src/sinon/util/core/sinon-type.js`
- Test: `test/mock-test.js`
- Test: `test/sandbox-test.js`
- Test: `test/fake-test.js`
- Test: `test/util/core/**/*`
- Test: `npm run test-contract`

- [ ] **Step 1: Port the remaining support modules that are still used from legacy `lib/`**

Convert the remaining sandbox/mock/core utility modules to ESM-authored `src/` files so that the generated `lib/` tree is fully built from `src/`.

- [ ] **Step 2: Remove legacy-source imports from the Rollup graph**

After this task, `src/` must no longer import author-maintained files from `lib/`.

Verification command:

```bash
rg -n "../lib|./lib|require\\(" src
```

Expected:
- no results

Any remaining `require(` in `src/` means the migration is incomplete for this initial milestone.

- [ ] **Step 3: Run focused regression tests**

Run:

```bash
npm run test-node -- test/mock-test.js test/sandbox-test.js test/fake-test.js test/util/core/**/*-test.js
npm run test-contract
```

Expected:
- mock/sandbox/util behavior remains stable
- packed consumer contracts remain stable

- [ ] **Step 4: Commit**

```bash
git add src/sinon src/sinon/util/core
git commit -m "refactor: complete initial esm source tree"
```

### Task 6: Upgrade An ESM-Only Dependency As The Proof Point

**Files:**
- Modify: `package.json`
- Modify: `src/sinon/colorizer.js`
- Modify: `src/sinon/spy-formatters.js`
- Test: `test/util/core/color-test.js`
- Test: `test/spy-formatters-test.js`
- Test: `npm run test-contract`

- [ ] **Step 1: Upgrade `supports-color` to the first ESM-only major**

Modify `package.json`:

```json
{
  "dependencies": {
    "supports-color": "^9.0.0"
  }
}
```

This is the canary dependency for the migration strategy.

- [ ] **Step 2: Keep the source import clean and synchronous**

Update `src/sinon/colorizer.js` to use a normal ESM import, not runtime `import()`:

```js
import supportsColor from "supports-color";

export default class Colorizer {
    constructor(colorSupport = supportsColor) {
        this.supportsColor = colorSupport;
    }
}
```

Do not introduce async loading anywhere in the runtime API.

- [ ] **Step 3: Rebuild and verify the generated CJS compatibility output still works**

Run:

```bash
npm install
npm run build
npm run test-node -- test/util/core/color-test.js test/spy-formatters-test.js
npm run test-contract
```

Expected:
- source ESM import works
- generated `lib/` compatibility output still satisfies CJS consumers
- packed tarball fixtures remain green

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/sinon/colorizer.js src/sinon/spy-formatters.js
git commit -m "build: prove esm-only dependency support in generated cjs output"
```

### Task 7: Switch Repo Conventions From `lib/` Source To `src/` Source

**Files:**
- Modify: `package.json`
- Modify: `README.md`
- Modify: `CONTRIBUTING.md`
- Modify: any test or tooling references that still point at source `lib/`
- Test: `npm run verify-esm-migration`

- [ ] **Step 1: Update watch, lint, and developer documentation to treat `src/` as the authored tree**

Modify:
- `package.json` watch-oriented scripts currently pointing at `lib`
- docs that refer to `lib/` as source

Examples:
- `test-dev` should watch `src` as the authored tree
- contributor docs should say `lib/` is generated CommonJS output

- [ ] **Step 2: Keep published package metadata stable**

Do not change these fields in the initial milestone unless contract tests require it:
- `main`
- `exports["."].require`
- `exports["."].import`
- `browser`
- `module`

The initial milestone is about source migration, not package-contract redesign.

- [ ] **Step 3: Run the full migration verification**

Run:

```bash
npm run lint
npm run build
npm run verify-esm-migration
```

Expected:
- lint passes
- build passes
- unit tests and contract tests pass

- [ ] **Step 4: Commit**

```bash
git add package.json README.md CONTRIBUTING.md
git commit -m "docs: switch contributors to esm source workflow"
```

## Migration Rules

- Never change the public API and the source format in the same step unless the contract suite stays green before and after.
- Never introduce runtime `import()` in the CJS compatibility path for synchronous APIs such as `sandbox.useFakeTimers()`.
- Prefer mechanical syntax conversion first, semantic cleanup second.
- When converting a module, preserve function names, arity, and object shape unless a test proves they are not part of the contract.
- Use JSDoc in the converted ESM modules, but do not add `.ts` source files.

## Exit Criteria For This Initial Milestone

- `src/` is the authored source tree for Sinon library code
- `lib/` is generated CommonJS compatibility output
- `pkg/` browser artifacts are still generated and contract-tested
- `npm run test-contract` passes
- `supports-color@9+` works through the generated compatibility build
- no intentional API changes are required for either CJS or ESM consumers
