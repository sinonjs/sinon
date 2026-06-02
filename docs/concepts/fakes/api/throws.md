---
title: fake.throws
description: Creates a fake, that throws an `Error` with the provided value as the `message` property.
---

# `fake.throws(messageOrError)`

Creates a fake, that throws an `Error` with the provided value as the `message` property.

When an `Error` is passed as the `value` argument, that will be the thrown value. If any other value is passed, that will be used for the `message` property of the thrown `Error`.

<<< ../../../.vitepress/tests/docs/fakes/api/throws.test.js
