---
layout: page
title: Migrating to v5.0 - Sinon.JS
breadcrumb: migrating to 5.0
---

As with all `MAJOR` releases in [`semver`](http://semver.org/), there are breaking changes in `sinon@5`.
This guide will walk you through those changes.

## `spy.reset()` is removed, use `spy.resetHistory()`

In a previous version we deprecated and aliased `spy.reset` in favour of using `spy.resetHistory`. `spy.reset` has now been removed, you should use `spy.resetHistory`.


## `sinon` is now a (default) sandbox

Since `sinon@5.0.0`, the `sinon` object is a default sandbox. Unless you have a very advanced setup or need a special configuration, you probably want to just use that one.

The old sandbox API is still available, so you don't **have** to do anything.

However, switching to using the default sandbox can help make your code more concise.
Now would be a good opportunity to tidy up your tests.


### Before `sinon@5.0.0`

In earlier versions, you would manually have to create sandboxes and keep references to them in order to restore them.

```js
const sandbox = sinon.createSandbox();

describe('myFunction', function() {
    afterEach(function () {
        sandbox.restore();
    });

    it('should make pie');
});
```


### From `sinon@5.0.0`

```js
describe('myFunction', function() {
    afterEach(function () {
        sinon.restore();
    });

    it('should make pie');
});
```
