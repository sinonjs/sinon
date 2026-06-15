---
title: stub.throws
description: Causes the stub to throw an Error.
---

# `stub.throws()`

Causes the stub to throw an Error.

## `stub.throws(message)`

<<< ../../../.vitepress/tests/docs/stubs/api/throws-1.test.js

## `stub.throws("name" [, "optional message"])`

Causes the stub to throw an exception with the `name` property set to the provided string. The message parameter is optional and will set the `message` property of the exception.

<<< ../../../.vitepress/tests/docs/stubs/api/throws-2.test.js

## `stub.throws(obj)`

Causes the stub to throw the provided error object.

<<< ../../../.vitepress/tests/docs/stubs/api/throws-3.test.js

## `stub.throws(function() { return new Error(); })`

Causes the stub to throw the exception returned by the function.

<<< ../../../.vitepress/tests/docs/stubs/api/throws-4.test.js
