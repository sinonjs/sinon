---
title: sinon.match
description: Requires the value to be == to the given number.
---

# `sinon.match(number);`

Requires the value to be == to the given number.

# `sinon.match(string);`

Requires the value to be a string and have the expectation as a substring.

# `sinon.match(regexp);`

Requires the value to be a string and match the given regular expression.

# `sinon.match(object);`

Requires the value to be not `null` or `undefined` and have at least the same properties as `expectation`.

This supports nested matchers.

# `sinon.match(function)`

See [`custom matchers`](../custom-matchers).

<<< ../../../.vitepress/tests/docs/matchers/api/match.test.js
