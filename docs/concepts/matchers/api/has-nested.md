---
title: sinon.match.hasNested
description: Requires the value to define the given `propertyPath`. Dot (`prop.prop`) and bracket (`prop[0]`) notations are supported as in [Lodash.get](https://lodash.com/docs/4.4.2#get).
---

# `sinon.match.hasNested(propertyPath[, expectation])`

Requires the value to define the given `propertyPath`. Dot (`prop.prop`) and bracket (`prop[0]`) notations are supported as in [Lodash.get](https://lodash.com/docs/4.4.2#get).

The propertyPath might be inherited via the prototype chain. If the optional expectation is given, the value at the propertyPath is deeply compared with the expectation. The expectation can be another matcher.

<<< ../../../.vitepress/tests/docs/matchers/api/has-nested-array.test.js

<<< ../../../.vitepress/tests/docs/matchers/api/has-nested-dot.test.js
