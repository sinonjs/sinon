---
title: Stubs
description: Functions with pre-programmed behavior. Like spies but with methods to configure return values, exceptions, and callbacks.
---

# Stubs

## What are stubs?

::: warning Consider Using Fakes Instead
[Fakes][fakes] are the recommended alternative to stubs for most use cases. They provide simpler, immutable behavior with the same spy API. Consider using `sinon.fake.returns()`, `sinon.fake.throws()`, etc. instead of stubs for new code. Stubs remain useful for advanced scenarios like call-specific behavior (`onCall()`) and property stubbing.
:::

Test stubs are functions, like [spies][spies], with pre-programmed behavior.

They support the full [test spy API][spy-api] in addition to methods which can be used to alter the stub's behavior.

Like spies, stubs can be either standalone, or wrap existing functions. When
wrapping an existing function with a stub, the original function is not called.

## When to use stubs?

Use a stub when you want to:

1. Control a method's behavior from a test, to force the code down a specific path. Examples include forcing a method to throw an error in order to test error handling.

   ```js
   import * as sinon from "sinon";
   const o = {
     greet: function (name) {
       console.log(`Hello ${name}`);
     }
   };
   // stub out the greet method and make it throw the error we need for our test
   const stub = sinon.stub(o, "greet").throws(new Error("I lost my pie :("));

   try {
     o.greet("Eleanor Rigby");
   } catch (error) {
     console.log(error);
     // => I lost my pie :(
   }
   ```

2. When you want to prevent a specific method from being called directly (possibly because it triggers undesired behavior, such as `readFile` or similar).

   ```js
   import * as sinon from "sinon";
   import * as fs from "fs";

   // stub out the readFile method
   sinon.stub(fs, "readFile").callsFake(function () {
     // and make it return the value we want for our test
     return Promise.resolve("Apple pie");
   });

   const fileContent = await fs.readFile("somefile");
   console.log(fileContent);
   // => Apple pie
   ```

## Defining stub behavior on consecutive calls

Calling behavior defining methods like [`returns`][returns] or [`throws`][throws] multiple times overrides the behavior of the stub. You can use the [`onCall`][on-call] method to make a stub respond differently on
consecutive calls.

[fakes]: /concepts/fakes/
[matchers]: /concepts/matchers/
[spies]: /concepts/spies/
[spy-api]: /concepts/spies/api/
[on-call]: ./api/on-call
[returns]: ./api/returns
[throws]: ./api/throws
