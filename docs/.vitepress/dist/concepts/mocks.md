---
url: /concepts/mocks.md
description: >-
  Fake methods with pre-programmed behavior and expectations. Fails tests if not
  used as expected.
---

# Mocks

## Introduction

::: warning Consider Using Fakes Instead
Mocks are powerful but easy to overuse. Consider using [fakes][fakes] with explicit assertions instead. Fakes provide simpler behavior replacement without coupling tests to implementation details. Reserve mocks for cases where upfront expectations truly clarify test intent.
:::

Mocks (and expectations) are fake methods (like [spies][spies]) with pre-programmed behavior (like [stubs][stubs]) as well as **pre-programmed expectations**.

A mock will fail your test if it is not used as expected.

## When to use mocks?

Mocks should only be used for the *method under test*. In every unit test, there should be one unit under test.

If you want to control how your unit is being used and like stating expectations upfront (as opposed to asserting after the fact), use a mock.

## When to **not** use mocks?

Mocks come with built-in expectations that may fail your test.

Thus, they enforce implementation details. The rule of thumb is: if you wouldn't add an assertion for some specific call, don't mock it. Use a stub instead.

In general you should have **no more than one** mock (possibly with several expectations) in a single test.

[Expectations][expectations] implement both the [spies][spies] and [stubs][stubs] APIs.

## Mocks vs Stubs vs Fakes

**Use mocks when:**

* You want to declare expectations upfront (before acting)
* You need to verify interactions immediately upon use
* The expectation itself clarifies the test's intent

**Use [stubs][stubs] when:**

* You need call-specific behavior (`onCall()`, `onFirstCall()`)
* You need argument-based behavior (`withArgs()`)
* You're controlling behavior but don't care about verification

**Use [fakes][fakes] when:**

* You need simple behavior replacement (recommended for most cases)
* You want immutable, predictable test doubles
* You prefer explicit assertions over built-in expectations

[expectations]: ./api/expectations

[fakes]: /concepts/fakes/

[spies]: /concepts/spies/

[stubs]: /concepts/stubs/
