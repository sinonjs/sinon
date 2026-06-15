---
title: fake.rejects
description: Creates a fake that returns a rejected `Promise` for the passed value.
---

# `fake.rejects(value)`

Creates a fake that returns a rejected `Promise` for the passed value.

If an `Error` is passed as the `value` argument, then that will be the value of the promise. If any other value is passed, then that will be used for the `message` property of the `Error` returned by the promise.

<<< ../../../.vitepress/tests/docs/fakes/api/rejects.test.js
