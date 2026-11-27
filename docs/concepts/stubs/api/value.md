---
title: stub.value
description: Defines a new value for this stub.
---

# `stub.value(newVal)`

Defines a new value for this stub.

<<< ../../../.vitepress/tests/docs/stubs/api/value-1.test.js

## Methods are not values

`.value()` replaces a data property. Calling it on a method throws a `TypeError`, because the method would be replaced by the value and every later call would fail elsewhere with a type error instead of at the stub. Use `.returns()` to control what the method returns, or `.callsFake()` to replace its implementation.

## Restoring values

You can restore values by calling the `restore` method:

<<< ../../../.vitepress/tests/docs/stubs/api/value-2.test.js
