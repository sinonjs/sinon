---
layout: page
title: General setup - Sinon.JS
breadcrumb: general-setup
---

We will be making fakes, spies and stubs. By default these are created in the _default sandbox_.
Be sure to `restore` this sandbox after each test.

For example, if you're using mocha you can place this in a test file at the root level:

```js
afterEach(() => {
  // Restore the default sandbox here
  sinon.restore();
});
```

Or in Jasmine you should place it in each describe:

```js
describe('My test suite', () => {

  afterEach(() => {
    // Restore the default sandbox here
    sinon.restore();
  });
});
```

Forgetting to restore your sandbox results in a memory leak.

For more advanced setups using multiple sandboxes, please see [sandbox](../sandbox)
