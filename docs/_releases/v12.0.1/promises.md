---
layout: page
title: Promises - Sinon.JS
breadcrumb: promises
---

### Introduction

`promise` allows to create fake promises that expose their internal state and can be resolved or rejected on demand.

### Creating a promise

```js
var promise = sinon.promise();
```

#### Creating a promise with a fake executor

```js
var executor = sinon.fake();
var promise = sinon.promise(executor);
```

#### Creating a promise with custom executor

```js
var promise = sinon.promise(function (resolve, reject) {
  // ...
});
```

### Promise API

#### `promise.status`

The internal status of the promise. One of `pending`, `resolved`, `rejected`.

#### `promise.resolvedValue`

The promise resolved value.

#### `promise.rejectedValue`

The promise rejected value.

#### `promise.resolve(value)`

Resolves the promise with the given value. Throws if the promise is not `pending`.

#### `promise.reject(value)`

Rejects the promise with the given value. Throws if the promise is not `pending`.
