# ESM Migration Stabilization Handoff Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stabilize the completed ESM migration by fixing the remaining `npm test` regressions, removing migration-era debugging noise, and getting the full suite back to green.

**Architecture:** The source migration is structurally complete enough for distribution contracts to pass, but the runtime behavior still diverges in a few hotspots. The failing surface is concentrated in sandbox lifecycle behavior, fake timers restoration, and a promise timeout path that is likely coupled to those same internals. The work must now move from “migration completion” to “behavior parity and noise cleanup.”

**Tech Stack:** Node.js, Mocha, Puppeteer, GitNexus impact analysis, ESLint, Sinon runtime source under `src/`

---

## Observed State From `npm test`

- Result: `1434 passing`, `12 pending`, `44 failing`
- The run produces substantial debug noise from nested sandbox tracking:
  - `ADDING NESTED SANDBOX TO COLLECTION...`
- The failure cluster is not random:
  - sandbox history/reset behavior
  - sandbox restoration on global objects
  - fake timers cleanup/restoration
  - promise behavior timing out

This is the handoff point: distribution contracts are green, but the unit suite is not.

---

## Non-Negotiable Rules

- Before editing any function, class, or method, run `gitnexus_impact({ target, direction: "upstream" })`.
- If impact is HIGH or CRITICAL, stop and report that before editing.
- Add or update regression tests before fixing runtime behavior.
- Keep changes clustered by root cause.
- Do not leave temporary debug logging in the final state.
- Before committing, run `gitnexus_detect_changes()` and verify the scope matches the stabilization plan.

---

## Task 1: Triage The 44 Failures Into Root-Cause Buckets

**Files:**
- Test: `test/issues/issues-test.js`
- Test: `test/promise-test.js`
- Test: `test/sandbox-test.js`
- Test: `test/util/fake-timers-test.js`
- Test: any source files implicated by those tests

- [ ] **Step 1: Run impact analysis on the likely fault-line symbols**
  - Run GitNexus impact on `Sandbox`, `restoreContext`, `resetHistory`, `useFakeTimers`, `promise`, `fake`, and any helper symbols those tests exercise.
  - Report the blast radius before changing code.

- [ ] **Step 2: Extract the failing clusters from the full test output**
  - Bucket the 44 failures into:
    - sandbox collection/reset behavior
    - sandbox restore on globals / property descriptors
    - fake timers install/restore/reset behavior
    - promise timeouts / unresolved executor behavior
  - Identify any test that is likely downstream of one of the above rather than a separate bug.

- [ ] **Step 3: Write the triage summary in the PR notes or working notes**
  - Record which failures are root causes and which are symptoms.
  - Record the first test in each cluster that should be used as the regression target.

- [ ] **Step 4: Re-run focused subsets to confirm cluster boundaries**
  - Run the smallest relevant subset for each cluster until the grouping is stable.
  - Expected:
    - the same failures repeat in each bucket
    - no hidden unrelated cluster appears

---

## Task 2: Remove Migration-Era Debug Noise

**Files:**
- Modify: the sandbox code that prints nested collection debug logs
- Modify: any logger or warning path that now emits during normal tests
- Test: `npm test`

- [ ] **Step 1: Locate the source of the nested sandbox log spam**
  - Identify the exact code path printing `ADDING NESTED SANDBOX TO COLLECTION...`.
  - Determine whether it is a permanent diagnostic, an accidental leftover, or a warning that should be behind an explicit debug flag.

- [ ] **Step 2: Decide whether the logging belongs at all**
  - If it was only added for migration debugging, remove it.
  - If it is useful in production, gate it behind a debug flag or existing warning mechanism.
  - Keep the default test output quiet.

- [ ] **Step 3: Verify the noise is gone**
  - Run:
    ```bash
    npm test -- --grep "sandbox"
    ```
    or the smallest relevant subset that triggers the logs.
  - Expected:
    - no repeated diagnostic spam in normal output
    - no behavior change from removing the logging

- [ ] **Step 4: Commit the noise cleanup separately if possible**
  - Keep the debug-log removal isolated from the functional fixes.

---

## Task 3: Fix Sandbox Reset And Nested Sandbox Semantics

**Files:**
- Modify: `src/sinon/sandbox.js`
- Modify: `src/create-sinon-api.js`
- Modify: any helper source files involved in sandbox collection/reset
- Test: `test/sandbox-test.js`
- Test: `test/issues/issues-test.js`

- [ ] **Step 1: Run impact analysis before changing sandbox lifecycle code**
  - Run GitNexus impact on `Sandbox`, `restoreContext`, `reset`, `resetHistory`, `spy`, `stub`, `fake`, and nested sandbox bookkeeping.
  - The sandbox path is high-risk because it affects many public APIs.

- [ ] **Step 2: Reproduce the failing sandbox cases with focused tests**
  - Target:
    - `sandbox.resetHistory`
    - spy/stub/fake collection membership
    - nested sandbox propagation
    - leak-threshold warnings if they are part of the failure surface
  - Confirm the exact invariants that are broken.

- [ ] **Step 3: Fix the collection and reset model**
  - Ensure nested sandboxes are tracked in a way that does not break:
    - `resetHistory`
    - `restore`
    - `restoreContext`
    - collection cleanup after use
  - Keep the public API shape and function names unchanged.

- [ ] **Step 4: Add or update regression tests for the restored behavior**
  - Cover:
    - resetting spies
    - restoring property spies
    - nested sandbox cleanup
    - fake/stub collection behavior

- [ ] **Step 5: Verify only sandbox-related tests changed behavior**
  - Run:
    ```bash
    npm run test-node -- test/sandbox-test.js test/issues/issues-test.js
    ```
  - Expected:
    - the sandbox failures disappear
    - no new failures appear in adjacent spy/stub tests

---

## Task 4: Fix Fake Timers Restoration And Global Descriptor Handling

**Files:**
- Modify: `src/sinon/util/fake-timers.js`
- Modify: `src/sinon/sandbox.js`
- Modify: any supporting descriptor helpers used by fake timers cleanup
- Test: `test/util/fake-timers-test.js`
- Test: `test/issues/issues-test.js`

- [ ] **Step 1: Run impact analysis on fake-timers and descriptor helpers**
  - Run GitNexus impact on `useFakeTimers`, `clock`, `restore`, `getPropertyDescriptor`, `isPropertyConfigurable`, and any helper used to restore globals.
  - This area is likely medium-to-high risk because it affects the global environment.

- [ ] **Step 2: Reproduce the failing cases with a minimal subset**
  - Focus on:
    - `sinon.restore spied fakeTimers`
    - `fakeTimers.clock.useFakeTimers`
    - resets of faked methods
    - restoration of timers installed on globals
  - Determine whether the bug is:
    - a missed restore
    - a descriptor mismatch
    - an accidental retention of clock state
    - a leak from nested sandbox tracking

- [ ] **Step 3: Fix the restore/reset path at the source**
  - Preserve the original property descriptor when faking globals.
  - Ensure restoration returns the exact original function/object shape expected by tests.
  - Avoid mutating shared clock state across sandbox boundaries.

- [ ] **Step 4: Add regression coverage for the descriptor edge cases**
  - Cover:
    - `setTimeout`/`clearTimeout`
    - `setImmediate`/`clearImmediate`
    - any global object restoration path involved in the failures
  - Keep the tests focused on a single restored property per case where possible.

- [ ] **Step 5: Verify fake timers behavior in isolation**
  - Run:
    ```bash
    npm run test-node -- test/util/fake-timers-test.js test/issues/issues-test.js
    ```
  - Expected:
    - all fake-timers regressions disappear
    - no new timing regressions appear in other sandbox tests

---

## Task 5: Fix Promise Timeout / Unresolved Executor Behavior

**Files:**
- Modify: `src/sinon/promise.js`
- Test: `test/promise-test.js`

- [ ] **Step 1: Run impact analysis on the promise helper**
  - Run GitNexus impact on `promise` and its direct upstream callers.
  - Confirm whether the promise timeout is an independent bug or a symptom of fake-timers behavior.

- [ ] **Step 2: Reproduce the timeout cases in isolation**
  - Target the three failing promise tests:
    - unresolved promise
    - resolve path
    - reject path
  - Determine whether they fail because:
    - the executor is not being called correctly
    - the callback wiring changed
    - fake timers are preventing the scheduled state transition from being observed

- [ ] **Step 3: Fix the smallest root cause**
  - If this is fake-timers dependent, fix fake timers first and only then revisit promise.
  - If the promise helper itself regressed, restore its executor/callback semantics without changing its public shape.

- [ ] **Step 4: Add a focused regression test if one is missing**
  - Keep the test synchronous if possible.
  - Use the narrowest reproduction that captures the timeout issue.

- [ ] **Step 5: Verify the promise path**
  - Run:
    ```bash
    npm run test-node -- test/promise-test.js
    ```
  - Expected:
    - the three promise failures disappear
    - no extra async failures are introduced

---

## Task 6: Run The Full Suite Until The Remaining Failures Are Gone

**Files:**
- Whatever source files the above tasks identify
- Test: `npm test`

- [ ] **Step 1: Re-run the targeted subsets after each fix**
  - After each root-cause fix, re-run only the affected tests first.
  - Do not stack fixes without verification.

- [ ] **Step 2: Re-run the full `npm test` suite**
  - Expected target:
    - all tests pass
    - debug noise is removed
    - no new regressions appear in the browser or webworker stages

- [ ] **Step 3: Run GitNexus change detection before final commit**
  - Run `gitnexus_detect_changes({ scope: "all" })` or staged equivalent.
  - Confirm the change set matches the stabilization tasks and nothing unrelated.

- [ ] **Step 4: Commit the stabilization work**
  - Use a commit message like:
    `fix: stabilize esm migration runtime regressions`

---

## Exit Criteria

- `npm run test-contract` passes
- `npm test` passes
- migration-era debug logging is removed or gated
- sandbox restore/reset behavior is stable
- fake timers restore/reset behavior is stable
- promise helper tests no longer time out
- the repo is ready for normal development again
