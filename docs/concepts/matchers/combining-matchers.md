---
title: Combining matchers
description: Combine multiple matchers using and(), or(), and not() for complex argument matching logic.
weight: 2
---

# Combining matchers

All matchers implement `and` and `or`. This allows to logically combine multiple matchers. The result is a new matcher that requires both (`and`) or one of the matchers (`or`) to return `true`.

<<< ../../.vitepress/tests/docs/matchers/combining-matchers.test.js
