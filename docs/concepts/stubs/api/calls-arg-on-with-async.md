---
title: stub.callsArgOnWithAsync
description: Causes the stub to call the argument at the provided index as a callback function, with the argument(s) provided and an additional `object` parameter to pass the [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this.
---

# `stub.callsArgOnWithAsync(index, object)`

Causes the stub to call the argument at the provided index as a callback function, with the argument(s) provided and an additional `object` parameter to pass the [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) context, asynchronously.

```js
import * as sinon from "sinon";
const person = {
  name: "Mickey Mouse"
};
const stub = sinon.stub().callsArgOnWithAsync(0, person, "Donald Duck");

function rename(newName) {
  this.name = newName;
}

stub(rename);
console.log(person.name);
// => "Mickey Mouse"

setTimeout(function () {
  console.log(person.name);
  // => "Donald Duck"
}, 1);
```

## Errors

When the argument at the provided `index` is not available or is not a function, an `Error` will be thrown.

```js
import * as sinon from "sinon";
const person = {
  name: "Mickey Mouse"
};
const stub = sinon.stub().callsArgOnWithAsync(0, person, "Donald Duck");

function rename(newName) {
  this.name = newName;
}

stub(undefined);
// => Uncaught TypeError: argument at index 0 is not a function: undefined
```

## See also

- [stub.callsArg](./calls-arg)
- [stub.callsArgAsync](./calls-arg-async)
- [stub.callsArgOn](./calls-arg-on)
- [stub.callsArgOnAsync](./calls-arg-on-async)
- [stub.callsArgOnWith](./calls-arg-on-with)
- [stub.callsArgWith](./calls-arg-with)
- [stub.callsArgWithAsync](./calls-arg-with-async)

## More information

- https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop
- https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
- YouTube: ["JavaScript Visualized - Event Loop, Web APIs, (Micro)task Queue"](https://www.youtube.com/watch?v=eiC58R16hb8) by Lydia Hallie
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
