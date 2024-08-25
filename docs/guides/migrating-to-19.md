---
layout: page
title: Migrating to v19 - Sinon.JS
breadcrumb: migrating to version 19
---

The (potentially) breaking changes in Sinon 19 relate to changes in the
underlying `@sinonjs/fake-timers` library.

The fake `Date` class we install is now a proper subclass of the real Date class, relying on a `Proxy` for some magic.
This should not affect anything, but there might be some exotic cases we are unaware of (please make us aware).

The most obvious breaking change is [PR 323 for fake-timers](https://github.com/sinonjs/fake-timers/pull/323):
it does away with the exception we have had up until now for `nextTick` and `queueMicroTask`. These were
_not_ installed by default, which came as a surprise to many, but ensured popular third party libraries for
Promises like Bluebird was unaffected. We think the time is now right for doing away with this exception, but
if you are affected by this change, you can choose to explicitly install the timers you need yourself,
instead of relying on the defaults.

Example: `FakeTimers.install({ toFake: ["setTimeout","clearTimeout"]}`
