---
title: stub.addBehavior
description: Add a custom behavior. The name will be available as a function on stubs, and the chaining mechanism will be set up for you (e.g. no need to return anything from your function, its return value wil...
---

# `stub.addBehavior(name, fn)`

Add a custom behavior. The name will be available as a function on stubs, and the chaining mechanism will be set up for you (e.g. no need to return anything from your function, its return value will be ignored). The `fn` will be passed the fake instance as its first argument, and then the user's arguments.

<<< ../../../.vitepress/tests/docs/stubs/api/add-behavior.test.js
