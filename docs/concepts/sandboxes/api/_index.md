---
title: Sandbox API
weight: 1
---

# Sandbox API

## Default sandbox

Since `sinon@5.0.0`, the `sinon` object is a default sandbox. Unless you have a very advanced setup or need a special configuration, you probably want to only use that one.

<<< @/.vitepress/tests/docs/sandboxes/api/_index.test.js

## Methods

- [`createStubInstance`](./create-stub-instance)
- [`mock`](./mock)
- [`replace`](./replace)
- [`replaceGetter`](./replace-getter)
- [`replaceSetter`](./replace-setter)
- [`reset`](./reset)
- [`resetBehavior`](./reset-behavior)
- [`resetHistory`](./reset-history)
- [`restore`](./restore)
- [`spy`](./spy)
- [`stub`](./stub)
- [`useFakeTimers`](./use-fake-timers)
- [`verify`](./verify)
- [`verifyAndRestore`](./verify-and-restore)

## Properties

- [`assert`](./assert)
- [`leakThreshold`](./leak-threshold)
