---
title: index
description: Spy objects are objects returned from `sinon.spy()`. When spying on existing methods with `sinon.spy(object, method)`, the following properties and methods
---

# Spy API

## Properties and methods on spied functions

Spy objects are objects returned from `sinon.spy()`. When spying on existing
methods with `sinon.spy(object, method)`, the following properties and methods
are also available on `object.method`.

### Example

## Methods

- [`alwaysCalledOn`](./always-called-on)
- [`alwaysCalledWith`](./always-called-with)
- [`alwaysCalledWithExactly`](./always-called-with-exactly)
- [`alwaysCalledWithMatch`](./always-called-with-match)
- [`alwaysReturned`](./always-returned)
- [`alwaysThrew`](./always-threw)
- [`calledAfter`](./called-after)
- [`calledBefore`](./called-before)
- [`calledImmediatelyAfter`](./called-immediately-after)
- [`calledImmediatelyBefore`](./called-immediately-before)
- [`calledOn`](./called-on)
- [`calledOnceWithExactly`](./called-once-with-exactly)
- [`calledWith`](./called-with)
- [`calledWithExactly`](./called-with-exactly)
- [`calledWithMatch`](./called-with-match)
- [`calledWithNew`](./called-with-new)
- [`calledOnceWith`](./called-once-with)
- [`getCall`](./get-call)
- [`getCalls`](./get-calls)
- [`neverCalledWith`](./never-called-with)
- [`neverCalledWithMatch`](./never-called-with-match)
- [`printf`](./printf)
- [`resetHistory`](./reset-history)
- [`restore`](./restore)
- [`returned`](./returned)
- [`threw`](./threw)
- [`withArgs`](./with-args)

## Properties

- [`args`](./args)
- [`callCount`](./call-count)
- [`called`](./called)
- [`calledOnce`](./called-once)
- [`calledThrice`](./called-thrice)
- [`calledTwice`](./called-twice)
- [`exceptions`](./exceptions)
- [`firstCall`](./first-call)
- [`lastCall`](./last-call)
- [`notCalled`](./not-called)
- [`returnValues`](./return-values)
- [`secondCall`](./second-call)
- [`thirdCall`](./third-call)
- [`thisValues`](./this-values)

[call]: /concepts/spy-call/
[matchers]: /concepts/matchers/
