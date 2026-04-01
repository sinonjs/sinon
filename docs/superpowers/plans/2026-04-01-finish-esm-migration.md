# Finish ESM Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the half-migrated Sinon ESM source transition so `src/` becomes the authored library tree, `lib/` becomes generated CJS compatibility output, and `npm run verify-esm-migration` passes end to end.

**Architecture:** Treat this as a completion project, not a feature add. The current repo already has a partial ESM source tree, Rollup generation, and distribution contract tests, but the runtime graph is still split across `src/` and legacy `lib/`. The finish line is: no author-maintained runtime code in `lib/`, no `src` imports from `lib`, lint/tooling aware of ESM files, and verification scripts aligned with the new package contract.

**Tech Stack:** Node.js, ESLint, Rollup, esbuild, Mocha, Puppeteer, npm pack contract tests, GitNexus impact analysis

---

## Non-Negotiable Rules

- Before editing any function, class, or method, run `gitnexus_impact({ target, direction: "upstream" })` and report the blast radius.
- If impact is HIGH or CRITICAL, stop and surface that to the human before editing.
- Before committing, run `gitnexus_detect_changes()` and verify the changed scope matches the plan.
- Do not rename symbols with search-and-replace. Use GitNexus rename if a rename is needed.
- Do not leave `src/` depending on `lib/` for author-maintained runtime code.
- Do not treat generated `lib/` as source of truth.

---

## Task 1: Fix Verification Tooling So ESM Files Are Understood

**Files:**
- Modify: `.eslintrc.yml`
- Modify: `test/.eslintrc.yml`
- Modify: `.eslintignore`
- Modify: `build.cjs`
- Modify: `test/distribution/browser-global-smoke.js`
- Modify: `test/es2015/check-esm-bundle-is-runnable.js`
- Modify: `scripts/test-distribution.mjs`
- Test: `npm run lint`
- Test: `npm run test-contract`

- [ ] **Step 1: Run impact analysis for the tooling files that will change**
  - Run GitNexus impact on `build.cjs`, `test/distribution/browser-global-smoke.js`, `test/es2015/check-esm-bundle-is-runnable.js`, and any lint config symbols if applicable.
  - Report the blast radius to the user before editing.

- [ ] **Step 2: Make ESLint recognize the repo’s ESM authoring files**
  - Update the root ESLint config so `.js` files in `src/` and `.mjs` files are parsed as modules.
  - Keep generated `lib/` out of the source lint pass if it is not meant to be hand-edited.
  - Make sure the config does not flag the repository’s build scripts or checked-in ESM fixtures as syntax errors.

- [ ] **Step 3: Stop lint from treating generated output like hand-authored source**
  - Exclude `lib/` from normal lint if the repo intends it to be generated.
  - If `lib/` must remain linted, add a separate generated-artifact lint rule set and scope it explicitly.
  - Eliminate the current `no-console` noise in `build.cjs` by scoping or disabling it only where necessary.

- [ ] **Step 4: Fix the package browser smoke test module format**
  - Convert `test/distribution/browser-global-smoke.js` to valid module-safe syntax for a `type: module` package.
  - Preserve its behavior: serve `pkg/sinon.js`, open Puppeteer, verify `window.sinon`, `spy`, `stub`, and `createSandbox`.
  - Make it runnable under the repo’s current Node/module settings.

- [ ] **Step 5: Keep the ESM browser smoke test aligned with the package contract**
  - Review `test/es2015/check-esm-bundle-is-runnable.js` so it asserts the intended default import + named import behavior from `pkg/sinon-esm.js`.
  - Make sure it still validates synchronous sandbox behavior and does not rely on legacy `lib/` internals.

- [ ] **Step 6: Rework distribution harness pathing if needed**
  - Ensure `scripts/test-distribution.mjs` resolves fixture paths and tarball extraction cleanly under the current package/module setup.
  - Keep the public API manifest check and fixture execution isolated from repo-local paths.

- [ ] **Step 7: Verify the tooling layer**
  - Run:
    ```bash
    npm run lint
    npm run test-contract
    ```
  - Expected:
    - lint no longer fails on the ESM source tree or generated artifacts
    - browser smoke tests execute under the repo’s module mode
    - contract suite still runs from the packed tarball

- [ ] **Step 8: Commit the tooling fix**
  - Commit only after the above commands pass.
  - Use a commit message like:
    `fix: align lint and smoke tests with esm migration`

---

## Task 2: Complete the Remaining ESM Source Port

**Files:**
- Create or modify: `src/sinon/colorizer.js`
- Create or modify: `src/sinon/spy-formatters.js`
- Create or modify: `src/sinon/proxy.js`
- Create or modify: `src/sinon/proxy-call.js`
- Create or modify: `src/sinon/proxy-call-util.js`
- Create or modify: `src/sinon/proxy-invoke.js`
- Create or modify: `src/sinon/spy.js`
- Create or modify: `src/sinon/fake.js`
- Create or modify: `src/sinon/assert.js`
- Create or modify: `src/sinon/collect-own-methods.js`
- Create or modify: `src/sinon/create-stub-instance.js`
- Create or modify: `src/sinon/throw-on-falsy-object.js`
- Create or modify: `src/sinon/mock.js`
- Create or modify: `src/sinon/default-behaviors.js`
- Create or modify: `src/sinon/util/core/export-async-behaviors.js`
- Create or modify: `src/sinon/util/core/next-tick.js`
- Create or modify: `src/sinon/util/core/get-next-tick.js`
- Create or modify: `src/sinon/util/core/walk.js`
- Create or modify: `src/sinon/util/core/walk-object.js`
- Create or modify: `src/sinon/util/core/get-property-descriptor.js`
- Create or modify: `src/sinon/util/core/is-property-configurable.js`
- Create or modify: `src/sinon/util/core/is-non-existent-property.js`
- Create or modify: `src/sinon/util/core/is-es-module.js`
- Create or modify: `src/sinon/util/core/is-restorable.js`
- Create or modify: `src/sinon/util/core/function-to-string.js`
- Create or modify: `src/sinon/util/core/times-in-words.js`
- Create or modify: `src/sinon/util/core/sinon-type.js`
- Create or modify: `src/create-sinon-api.js`
- Test: `test/spy-test.js`
- Test: `test/stub-test.js`
- Test: `test/assert-test.js`
- Test: `test/sandbox-test.js`
- Test: `test/mock-test.js`
- Test: `test/fake-test.js`
- Test: `test/proxy-test.js`
- Test: `test/util/core/**/*-test.js`
- Test: `npm run test-contract`

- [ ] **Step 1: Run impact analysis before touching each runtime cluster**
  - Run `gitnexus_impact({ target: "spy", direction: "upstream" })`
  - Run `gitnexus_impact({ target: "stub", direction: "upstream" })`
  - Run `gitnexus_impact({ target: "Sandbox", direction: "upstream" })`
  - Run `gitnexus_impact({ target: "mock", direction: "upstream" })`
  - Run `gitnexus_impact({ target: "fake", direction: "upstream" })`
  - Run `gitnexus_impact({ target: "createApi", direction: "upstream" })`
  - If any are HIGH or CRITICAL, stop and report why.

- [ ] **Step 2: Port the spy/proxy/assert cluster to ESM source**
  - Convert the modules powering the public spy/stub/assert behavior.
  - Preserve function names, arity, return shape, and synchronous behavior.
  - Use consistent ESM import style inside each module.
  - Do not import from `lib/` in any file under `src/`.

- [ ] **Step 3: Port the mock/sandbox/core utility cluster to ESM source**
  - Convert the support modules that `sandbox`, `mock`, `fake`, `promise`, and `restore` depend on.
  - Keep `sandbox.useFakeTimers()` synchronous.
  - Keep the public root API object shape unchanged.
  - Preserve the `createSandbox`, `match`, `restoreObject`, `expectation`, `timers`, `addBehavior`, and `promise` root properties.

- [ ] **Step 4: Keep the root API builder ESM-native**
  - Ensure `src/create-sinon-api.js` remains a real ESM module.
  - It may still adapt existing dependencies, but it must no longer require legacy source files.
  - It must still return the same top-level object shape as the current implementation.

- [ ] **Step 5: Add or preserve JSDoc only where it helps migration stability**
  - Keep JSDoc on exported factory functions and config arguments.
  - Do not convert the package to TypeScript.
  - Do not over-annotate generated compatibility files.

- [ ] **Step 6: Add focused regression tests while porting**
  - Run the smallest relevant test files after each subcluster lands.
  - Use the root tests to confirm spy/stub/mock/sandbox behavior did not regress.
  - Use the core utility tests for utility-specific changes.

- [ ] **Step 7: Verify the source tree no longer depends on `lib/`**
  - Run:
    ```bash
    rg -n "../lib|./lib|require\\(" src
    ```
  - Expected:
    - no author-maintained `src` files import legacy `lib`
    - any remaining `require(` in `src` is intentional and justified
  - If the search still shows legacy dependencies, keep porting until it is clean.

- [ ] **Step 8: Re-run unit and contract tests**
  - Run:
    ```bash
    npm run test-node -- test/spy-test.js test/stub-test.js test/assert-test.js test/sandbox-test.js test/mock-test.js test/fake-test.js test/proxy-test.js test/util/core/**/*-test.js
    npm run test-contract
    ```
  - Expected:
    - legacy behavior remains intact
    - packed tarball contract still passes

- [ ] **Step 9: Commit the source migration**
  - Use a commit message like:
    `refactor: complete esm source migration for sinon runtime`

---

## Task 3: Regenerate `lib/` Fully From `src/`

**Files:**
- Modify: `rollup.config.mjs`
- Modify: `build.cjs`
- Modify: `package.json`
- Modify: `lib/package.json`
- Generated: `lib/**/*.js`
- Test: `npm run build`
- Test: `npm run test-contract`

- [ ] **Step 1: Run impact analysis on the build pipeline symbols**
  - Run `gitnexus_impact({ target: "buildAll", direction: "upstream" })`
  - Run `gitnexus_impact({ target: "makeBundle", direction: "upstream" })`
  - Run `gitnexus_impact({ target: "createApi", direction: "upstream" })`
  - Warn the user if the build graph risk is high.

- [ ] **Step 2: Make Rollup build only from `src/`**
  - Confirm the Rollup config no longer falls back to `lib/` as a source tree.
  - Include all required source entry points so the generated `lib/` tree is complete.
  - Keep `lib/package.json` as the CommonJS boundary.

- [ ] **Step 3: Make `build.cjs` consume generated `lib/` only after Rollup completes**
  - Ensure it runs Rollup first.
  - Then load `./lib/sinon`.
  - Then generate `pkg/sinon.js`, `pkg/sinon-no-sourcemaps.cjs`, and `pkg/sinon-esm.js`.
  - Preserve the existing browser artifact behavior.

- [ ] **Step 4: Update package metadata only if needed**
  - Keep the public package contract stable unless contract tests prove a metadata change is required.
  - Avoid unnecessary changes to `main`, `browser`, `module`, or `exports`.

- [ ] **Step 5: Regenerate and inspect the built `lib/` tree**
  - Run:
    ```bash
    npm run build
    ```
  - Inspect whether the new `lib/` tree now comes entirely from `src/`.
  - Verify there are no missing generated modules and no legacy source gaps.

- [ ] **Step 6: Re-run the distribution suite**
  - Run:
    ```bash
    npm run test-contract
    ```
  - Expected:
    - tarball fixtures pass
    - browser bundle smoke tests pass
    - manifest check still passes

- [ ] **Step 7: Commit the build regeneration**
  - Use a commit message like:
    `build: generate cjs compatibility output from esm source`

---

## Task 4: Align Repo Conventions and Verification With the New Architecture

**Files:**
- Modify: `package.json`
- Modify: `README.md`
- Modify: `CONTRIBUTING.md`
- Modify: any test/watch scripts that still point at `lib/` as authored source
- Test: `npm run verify-esm-migration`

- [ ] **Step 1: Update developer-facing conventions**
  - Document that `src/` is the authored source tree.
  - Document that `lib/` is generated CommonJS output.
  - Clarify that contract tests gate any source-layout migration.

- [ ] **Step 2: Update watch and verification scripts**
  - Make sure `test-dev` and any similar scripts watch the authored tree rather than the generated tree, if appropriate.
  - Keep `verify-esm-migration` as the full local pre-merge gate.
  - Ensure the script order is meaningful:
    - lint
    - contract tests
    - unit tests

- [ ] **Step 3: Preserve package contract docs**
  - Keep the docs aligned with actual published entry points.
  - Make sure the docs mention `test-contract` as the migration guard.

- [ ] **Step 4: Run the final verification sequence**
  - Run:
    ```bash
    npm run lint
    npm run build
    npm run test-contract
    npm run verify-esm-migration
    ```
  - Expected:
    - lint passes
    - build passes
    - contract tests pass
    - the full migration verification passes

- [ ] **Step 5: Run GitNexus change detection before committing**
  - Run `gitnexus_detect_changes({ scope: "all" })` or staged equivalent.
  - Verify only the expected source, tooling, and docs symbols changed.
  - Do not commit until the blast radius matches the plan.

- [ ] **Step 6: Commit the completed migration**
  - Use a final commit message like:
    `docs: finish esm migration and verification alignment`

---

## Exit Criteria

- `src/` is the authored runtime source tree
- `lib/` is generated compatibility output
- `src/` no longer depends on `lib/`
- `npm run lint` passes
- `npm run build` passes
- `npm run test-contract` passes
- `npm run verify-esm-migration` passes
- package docs and scripts reflect the new architecture

If you want, I can also turn this into a ready-to-save file at `docs/superpowers/plans/2026-04-01-finish-esm-migration.md`.
