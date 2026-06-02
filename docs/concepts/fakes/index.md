---
title: Fakes
description: Simple, immutable test doubles that replace spies and stubs. Records arguments, return values, and exceptions for all calls.
---

# Fakes

## Introduction

`sinon.fake` allows creation of a `fake` `Function` with the ability to set a default behavior.

In Sinon, a `fake` is a `Function` that records arguments, return value, the value of `this` and `Error` thrown (if any) for all of its calls.

A fake is an [immutable object][immutable]: once created, its behavior will not change.

### Basic usage

<<< ../../.vitepress/tests/docs/fakes/basic-usage.test.js

## Prefer fakes over spies and stubs

Fakes are alternatives to the older [spies][spies] and [stubs][stubs], and can replace them in all use cases.

They are designed to be simpler and easier to use, while avoiding confusion by being [immutable][immutable].

All `fakes` [have the same API][spy-api] as [`spies`][spies]. This includes access to call information through the [spy call API][spy-call-api], such as `firstArg`, `lastArg`, and `callback` properties.

## Using fakes instead of spies

<<< ../../.vitepress/tests/docs/fakes/_index-1.test.js

## Using fakes instead of stubs

<<< ../../.vitepress/tests/docs/fakes/_index-2.test.js

[spies]: /concepts/spies/
[spy-api]: /concepts/spies/api/
[spy-call-api]: /concepts/spy-call/api/
[stubs]: /concepts/stubs/
[replace]: /concepts/sandboxes/api/replace
[immutable]: https://en.wikipedia.org/wiki/Immutable_object
