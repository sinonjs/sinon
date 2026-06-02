---
url: /concepts/mocks/api/_index.md
---

# Mock API

## Creating a mock

Create a mock for the provided object.

This does not change the object, but returns a mock object to set expectations on the object's methods.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("mock - creating a mock", (t) => {
  const obj = {
    greet: function (name) {
      return `Hello ${name}`;
    }
  };
  const mock = sinon.mock(obj);

  t.ok(mock, "mock object created");
  t.type(mock.expects, "function", "mock has expects method");
  t.type(mock.verify, "function", "mock has verify method");
  t.type(mock.restore, "function", "mock has restore method");

  mock.restore();

  t.end();
});

```

## Methods

* [expects][expects]
* [restore][restore]
* [verify][verify]

## Properties

* [expectations][expectations]

[expects]: ./expects

[expectations]: ./expectations.md

[restore]: ./restore

[verify]: ./verify
