---
title: Getting started
description: Learn how to install and set up Sinon.JS with your test runner. Includes examples using Node-Tap, Mocha, Jest, and more.
---

# Getting started

The examples will be using [Node-Tap](https://node-tap.org), which is the simplest _complete_ test runner that is known to Sinon maintainers.

You can use Sinon with most popular test runners, such as [Mocha](https://mochajs.org), [Jasmine](https://jasmine.github.io), [Jest](https://jestjs.io), etc.

## Installing

```sh
npm install -D sinon
```

## Using

<<< @/.vitepress/tests/docs/getting-started.test.js

## Cleaning up after tests

In order to avoid memory leaks, which could lead to unpredictable test failures, it is recommended to [`restore`][sandbox-restore] Sinon's default sandbox after each test.

```js
t.afterEach((t) => {
  sinon.restore();
});
```

For more advanced setups with sandboxes, please see the [sandbox](/concepts/sandboxes/) section.

[default-sandbox]: ./sandboxes#default-sandbox
[sandbox-restore]: /concepts/sandboxes/api/restore
[fakes]: ./fakes
[spies]: ./spies
[stubs]: ./stubs
