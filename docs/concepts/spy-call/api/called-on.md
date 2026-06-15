---
title: spyCall.calledOn
description: Returns `true` when `obj` was context (`this`) for the call.
---

# `spyCall.calledOn(obj);`

Returns `true` when `obj` was context (`this`) for the call.

<<< ../../../.vitepress/tests/docs/spy-call/api/called-on-1.test.js

## Using a matcher

`calledOn` also accepts a matcher `spyCall.calledOn(sinon.match(fn))` (see [matchers](/concepts/matchers/)).

<<< ../../../.vitepress/tests/docs/spy-call/api/called-on-2.test.js

## See also

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
