---
title: Custom matchers
description: Create custom matcher functions using sinon.match() to define flexible matching logic for your tests.
weight: 3
---

# Custom matchers

Custom matchers are created with the `sinon.match` factory.

The test function takes a value as the only argument. It must return `true`, when the value matches the expectation and `false` otherwise.

<!-- TODO:
  figure out if the second argument (message) is ever used in sinon, or only in sinon.assert project,
  if that's true, remove support for second argument in sinon

  > The message string is used to generate the error message in case the value does not match the expectation.
-->

<<< ../../.vitepress/tests/docs/matchers/custom-matchers.test.js
