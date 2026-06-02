---
url: /concepts/stubs/api/calls-arg-on-async.md
description: >-
  Causes the stub to call the argument at the provided `index` as a callback
  function, with an additional `object` parameter to pass the
  [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
  context, asynchronously.
---

# `stub.callsArgOnAsync(index, object)`

Causes the stub to call the argument at the provided `index` as a callback function, with an additional `object` parameter to pass the [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) context, asynchronously.

```js
import * as sinon from "sinon";
const car = {
  color: "red"
};
const stub = sinon.stub().callsArgOnAsync(0, car);

function updateColor() {
  this.color = "blue";
}

console.log(car.color);
// => red

stub(updateColor);
console.log(car.color);
// => red

setTimeout(function () {
  console.log(car.color);
  // => blue
}, 1);
```

## Errors

When the argument at the provided `index` is `undefined`, or not a function,
an `Error` will be thrown.

```js
import * as sinon from "sinon";
const car = {
  color: "red"
};
const stub = sinon.stub().callsArgOnAsync(0, car);

const pie = "apple pie";

stub(pie);
// => Uncaught TypeError: argument at index 0 is not a function: apple pie

stub(nonExistingCallback);
// => Uncaught ReferenceError: nonExistingCallback is not defined
```

## See also

* [stub.callsArg](./calls-arg)
* [stub.callsArgAsync](./calls-arg-async)
* [stub.callsArgOn](./calls-arg-on)
* [stub.callsArgOnWith](./calls-arg-on-with)
* [stub.callsArgOnWithAsync](./calls-arg-on-with-async)
* [stub.callsArgWith](./calls-arg-with)
* [stub.callsArgWithAsync](./calls-arg-with-async)

## More information

* https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop
* https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
* YouTube: ["JavaScript Visualized - Event Loop, Web APIs, (Micro)task Queue"](https://www.youtube.com/watch?v=eiC58R16hb8) by Lydia Hallie
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
