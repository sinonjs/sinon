---
url: /concepts/fakes/api.md
description: >-
  Create and configure fake functions with returns, throws, yields, and async
  behavior.
---

# Fakes API

There are three ways you can create fakes:

1. Create an empty fake
2. Wrap an existing function
3. Use a fake factory

## Create an empty fake

A basic fake can be created with no behavior. It saves call information.

## Wrap an existing function

You can use `sinon.fake` to wrap an existing function.
This can be used for either observing the [system under test][SUT], or for creating complex fakes with behaviour. You can pass an arbitrarily complex function to `sinon.fake` to create custom behavior for a test.

## Use a fake factory

The API has a few factories to quickly create fakes with behavior:

* [fake.rejects][rejects]
* [fake.resolves][resolves]
* [fake.returns][returns]
* [fake.throws][throws]
* [fake.yields][yields]
* [fake.yieldsAsync][yieldsAsync]

## Plugging in the fake

Unlike [`sinon.spy`][spies] and [`sinon.stub`][stubs] methods, the `sinon.fake` API knows only how to *create* fakes, and doesn't concern itself with plugging them into the system under test.

To plug the fakes into the system under test, you can use the [`sinon.replace*`][replace] methods.

[rejects]: ./rejects

[resolves]: ./resolves

[returns]: ./returns

[throws]: ./throws

[yields]: ./yields

[yieldsAsync]: ./yields-async

[spies]: /concepts/spies/

[stubs]: /concepts/stubs/

[replace]: /concepts/sandboxes/api/replace

[readFile]: https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback

[SUT]: https://en.wikipedia.org/wiki/System_under_test
