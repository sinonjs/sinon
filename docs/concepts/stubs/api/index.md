---
title: index
description: Creates an anonymous stub function
---

# Stub API

## Creating a stub

### `sinon.stub()`

Creates an anonymous stub function

### `sinon.stub(object, "method")`

Replaces `object.method` with a stub function. An exception is thrown if the property is not already a function.

The original function can be restored by calling `object.method.restore()` (or `stub.restore()`).

## Advanced use

### `sinon.stub(obj)`

Stubs all the object's methods.

Note that it's usually better practice to stub individual methods, particularly on objects that you don't understand or control all the methods for (e.g. library dependencies).

Stubbing individual methods shows intent more precisely and is less susceptible to unexpected behavior as the object's code evolves.

### `sinon.createStubInstance(MyConstructor, overrides)`

When you want to create a stub object of `MyConstructor`, but don't want the constructor to be invoked, use this utility function.

`overrides` is an optional map overriding created stubs, for example:

is the same as:

If provided value is not a stub, it will be used as the returned value:

is the same as:

## Methods

- [`addBehavior`][add-behavior]
- [`callArg`][call-arg]
- [`callArgWith`][call-arg-with]
- [`callsArg`][calls-arg]
- [`callsArgAsync`][calls-arg-async]
- [`callsArgOn`][calls-arg-on]
- [`callsArgOnWith`][calls-arg-on-with]
- [`callsArgOnWithAsync`][calls-arg-on-with-async]
- [`callsArgWith`][calls-arg-with]
- [`callsArgWithAsync`][calls-arg-with-async]
- [`callsFake`][calls-fake]
- [`callsThrough`][calls-through]
- [`callThroughWithNew`][call-through-with-new]
- [`get`][get]
- [`onCall`][on-call]
- [`onFirstCall`][on-first-call]
- [`onSecondCall`][on-second-call]
- [`onThirdCall`][on-third-call]
- [`rejects`][rejects]
- [`reset`][reset]
- [`resetBehavior`][resetBehavior]
- [`resetHistory`][resetHistory]
- [`resolves`][resolves]
- [`resolvesArg`][resolvesArg]
- [`returns`][returns]
- [`returnsThis`][returnsThis]
- [`set`][set]
- [`throws`][throws]
- [`throwsArg`][throws-arg]
- [`value`][value]
- [`withArgs`][with-args]
- [`yield`][yield]
- [`yieldTo`][yield-to]
- [`yields`][yields]
- [`yieldsAsync`][yields-async]
- [`yieldsOn`][yields-on]
- [`yieldsOnAsync`][yields-on-async]
- [`yieldsRight`][yields-right]
- [`yieldsTo`][yields-to]
- [`yieldsToAsync`][yields-to-async]
- [`yieldsToOn`][yields-to-on]
- [`yieldsToOnAsync`][yields-to-on-async]

## Properties

- [`wrappedMethod`][wrapped-method]

---

[add-behavior]: ./add-behavior
[call-arg]: ./call-arg
[call-arg-with]: ./call-arg-with
[calls-arg]: ./calls-arg
[calls-arg-async]: ./calls-arg-async
[calls-arg-on]: ./calls-arg-on
[calls-arg-on-with]: ./calls-arg-on-with
[calls-arg-on-with-async]: ./calls-arg-on-with-async
[calls-arg-with]: ./calls-arg-with
[calls-arg-with-async]: ./calls-arg-with-async
[calls-fake]: ./calls-fake
[calls-through]: ./calls-through
[call-through-with-new]: ./call-through-with-new
[get]: ./get
[matchers]: /concepts/matchers/
[on-call]: ./on-call
[on-first-call]: ./on-first-call
[on-second-call]: ./on-second-call
[on-third-call]: ./on-third-call
[rejects]: ./rejects
[reset]: ./reset
[resetBehavior]: ./reset-behavior
[resetHistory]: ./reset-history
[resolves]: ./resolves
[resolvesArg]: ./resolves-arg
[returns]: ./returns
[returnsThis]: ./returns-this
[throws]: ./throws
[set]: ./set
[throws-arg]: ./throws-arg
[value]: ./value
[with-args]: ./with-args
[wrapped-method]: ./wrapped-method
[yield]: ./yield
[yield-to]: ./yield-to
[yields]: ./yields
[yields-async]: ./yields-async
[yields-on]: ./yields-on
[yields-on-async]: ./yields-on-async
[yields-right]: ./yields-right
[yields-to]: ./yields-to
[yields-to-async]: ./yields-to-async
[yields-to-on]: ./yields-to-on
[yields-to-on-async]: ./yields-to-on-async
