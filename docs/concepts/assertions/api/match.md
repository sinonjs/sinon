---
title: assert.match
description: Uses [`sinon.match`][matchers] to test if the arguments can be considered a match.
---

# `assert.match(actual, expectation);`

Uses [`sinon.match`][matchers] to test if the arguments can be considered a match.

```js
import * as sinon from "sinon";

const expected = { x: 1 };
const actual = { x: 1, y: 2 };

// Generates no errors
sinon.assert.match(actual, expected);

// Doesn't match
sinon.assert.match({ y: 3 }, expected);
// => Uncaught Error [AssertError]: expected value to match
// =>     expected = { x: 1 }
// =>     actual = { y: 3 }
```

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/match.test.js

[matchers]: /concepts/matchers/
