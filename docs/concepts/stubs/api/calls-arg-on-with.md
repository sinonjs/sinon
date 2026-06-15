---
title: stub.callsArgOnWith
description: Causes the stub to call the argument at the provided `index` as a callback function, with the argument(s) provided and an additional `object` parameter to pass the [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
---

# `stub.callsArgOnWith(index, object)`

Causes the stub to call the argument at the provided `index` as a callback function, with the argument(s) provided and an additional `object` parameter to pass the [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) context.

```js
import * as sinon from "sinon";
const person = {
  name: "Mickey Mouse"
};
const stub = sinon
  .stub()
  .callsArgOnWith(0, person, "apple", "banana", "cherry");

function hello(first, second, third) {
  console.log(this.name);
  console.log(first, second, third);
}

stub(hello);
// => Mickey Mouse
// => apple banana cherry
```

## Errors

When the argument at the provided `index is not available or is not a function, an `Error` will be thrown.

```js
import * as sinon from "sinon";
const person = {
  name: "Mickey Mouse"
};
const stub = sinon
  .stub()
  .callsArgOnWith(0, person, "apple", "banana", "cherry");

function hello(first, second, third) {
  console.log(this.name);
  console.log(first, second, third);
}

stub(undefined);
// => Uncaught TypeError: argument at index 0 is not a function: undefined
```

## See also

- [stub.callsArg](./calls-arg)
- [stub.callsArgAsync](./calls-arg-async)
- [stub.callsArgOn](./calls-arg-on)
- [stub.callsArgOnAsync](./calls-arg-on-async)
- [stub.callsArgOnWithAsync](./calls-arg-on-with-async)
- [stub.callsArgWith](./calls-arg-with)
- [stub.callsArgWithAsync](./calls-arg-with-async)
