---
title: sinon.match.has
description: Requires the value to define the given `property`.
---

# `sinon.match.has(property[, expectation])`

Requires the value to define the given `property`.

The property might be inherited via the prototype chain. If the optional expectation is given, the value of the property is deeply compared with the expectation. The expectation can be another matcher.

<<< ../../../.vitepress/tests/docs/matchers/api/has.test.js
