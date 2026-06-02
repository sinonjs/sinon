---
url: /concepts/fakes/api/yields.md
description: >-
  Makes a fake call the callback with the provided values. The last argument
  must be a callback function.
---

# `fake.yields([value1, ..., valueN]);`

`fake.yields` takes some values, and returns a function. This function expects the last argument to be a callback. It invokes the callback with the previously given values.

The function returned from `fake.yields` is typically used to mimic a service function that takes a callback as the last argument.

In the example below, the [`readFile`][readFile] function of the `fs` module is replaced with a `fake` created by `fake.yields`.
When the fake function is called, it calls the last argument it received, which is expected to be a callback, with the values that the `yields` function previously took.

```js
import tap from "tap";
import * as sinon from "sinon";
import fs from "fs";

tap.test("fake.yields", (t) => {
  const fake = sinon.fake.yields(null, "file content");
  const anotherFake = sinon.fake();

  sinon.replace(fs, "readFile", fake);

  fs.readFile("somefile", (err, data) => {
    // called with fake values given to yields as arguments
    t.equal(err, null, "callback receives null error");

    t.equal(data, "file content", "callback receives file content");

    // since yields is synchronous, anotherFake is not called yet
    t.notOk(anotherFake.called, "anotherFake not called yet");

    sinon.restore();
    t.end();
  });

  anotherFake();
});

tap.test("fake.yields throws when last argument is not a function", (t) => {
  const fake = sinon.fake.yields("error", "data");

  t.throws(
    () => fake("not a callback"),
    /Expected last argument to be a function/,
    "throws TypeError when last argument is not a function"
  );

  t.end();
});

```

[readFile]: https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback
