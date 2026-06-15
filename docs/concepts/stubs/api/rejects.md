---
title: stub.rejects
description: "<!-- TODO: update this after https://github.com/sinonjs/sinon/issues/1679 is resolved -->"
---

<!--
TODO: update this after https://github.com/sinonjs/sinon/issues/1679 is resolved
-->

# `stub.rejects()`

Causes the stub to return a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which rejects.

## `stub.rejects();`

Causes the stub to return a Promise which rejects with an [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error). Use this when you don't care about what the value of the error is.

<<< ../../../.vitepress/tests/docs/stubs/api/rejects-1.test.js

## `stub.rejects(errorName);`

Causes the stub to return a Promise which rejects with an [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error), with `name` property set to the `errorName` argument and a blank `message` property.

<<< ../../../.vitepress/tests/docs/stubs/api/rejects-2.test.js

## `stub.rejects(errorName, errorMessage);`

Causes the stub to return a Promise which rejects with an [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error), with `name` property set to the provided `errorName` and the `message` property set to the `errorMessage` argument.

<<< ../../../.vitepress/tests/docs/stubs/api/rejects-3.test.js

## `stub.rejects(error);`

When called with an [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) instance, it causes the stub to return a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which rejects with the provided error instance.

<<< ../../../.vitepress/tests/docs/stubs/api/rejects-4.test.js

## Note

When constructing the Promise, sinon uses the `Promise.reject` method.
