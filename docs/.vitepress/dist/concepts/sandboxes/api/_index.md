---
url: /concepts/sandboxes/api/_index.md
---

# Sandbox API

## Default sandbox

Since `sinon@5.0.0`, the `sinon` object is a default sandbox. Unless you have a very advanced setup or need a special configuration, you probably want to only use that one.

```js
import t from "tap";
import sinon from "sinon";

t.test("default sandbox can stub and restore properties", (t) => {
  const myObject = {
    hello: "world"
  };

  // Stub the property
  sinon.stub(myObject, "hello").value("Sinon");

  // Verify the stub works
  t.equal(myObject.hello, "Sinon", "property should be stubbed to 'Sinon'");

  // Restore
  sinon.restore();

  // Verify restoration
  t.equal(myObject.hello, "world", "property should be restored to 'world'");

  t.end();
});

```

## Methods

* [`createStubInstance`](./create-stub-instance)
* [`mock`](./mock)
* [`replace`](./replace)
* [`replaceGetter`](./replace-getter)
* [`replaceSetter`](./replace-setter)
* [`reset`](./reset)
* [`resetBehavior`](./reset-behavior)
* [`resetHistory`](./reset-history)
* [`restore`](./restore)
* [`spy`](./spy)
* [`stub`](./stub)
* [`useFakeTimers`](./use-fake-timers)
* [`verify`](./verify)
* [`verifyAndRestore`](./verify-and-restore)

## Properties

* [`assert`](./assert)
* [`leakThreshold`](./leak-threshold)
