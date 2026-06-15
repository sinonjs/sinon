---
title: fake.yields
description: "Makes a fake call the callback with the provided values. The last argument must be a callback function."
---

# `fake.yields([value1, ..., valueN]);`

`fake.yields` takes some values, and returns a function. This function expects the last argument to be a callback. It invokes the callback with the previously given values.

The function returned from `fake.yields` is typically used to mimic a service function that takes a callback as the last argument.

In the example below, the [`readFile`][readFile] function of the `fs` module is replaced with a `fake` created by `fake.yields`.
When the fake function is called, it calls the last argument it received, which is expected to be a callback, with the values that the `yields` function previously took.

<<< ../../../.vitepress/tests/docs/fakes/api/yields.test.js

[readFile]: https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback
