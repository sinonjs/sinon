---
layout: page
title: How to stub out CommonJS modules
---

This page describes how to isolate your system under test, by targetting the [link seams][seams]; replacing your dependencies with stubs you control.

> If you want a better understand of the example and get a good description of what _seams_ are, we recommend that you read the [seams (all 3 web pages)][seams] excerpt from the classic [Working Effectively with Legacy Code][legacy], though it is not strictly necessary.

This guide targets the CommonJS module system, made popular by NodeJS. There are other module systems, but until recent years this was the de-facto module system and even when the actual EcmaScript Module standard arrived in 2015, transpilers and bundlers can still _output_ code as CJS modules. For instance, Typescript outputs CJS modules per default as of 2023, so it is still relevant, as your `import foo from './foo'` might still end up being transpiled into `const foo = require('./foo')` in the end.

<!-- TODO: input link to the other article on stubbing ESM -->

## Hooking into `require`
For us to replace the underlying calls done by `require` we need a tool to hook into the process. There are many tools that can do this: rewire, proxyquire, the newcomer [Quibble][quibble], etc. This example will be using [proxyquire][proxyquire] to construct our _seams_ (i.e. replace the modules), but the actual mechanics will be very similar for the other tools.

Read it?

Great! Let's continue.

## Example

The folder structure in our example looks like this

```
.
├── lib
│   └── does-file-exist.js
└── test
    └── does-file-exist.test.js
```

[Source and runnable demo of the example code][demo-proxyquire].

### Source file: `lib/does-file-exist.js`

This is the source file of the module `doesFileExist`, it only has one dependency: `fs`.

```javascript
var fs = require("fs");

function doesFileExist(path) {
  return fs.existsSync(path);
}

module.exports = doesFileExist;
```

### Test file: `test/does-file-exist.test.js`

In order to isolate our `doesFileExist` module for testing, we will stub out `fs` and provide a fake implementation of `fs.existsSync`, where we have complete control of the behaviour.

```javascript
var proxyquire = require("proxyquire");
var sinon = require("sinon");
var assert = require("referee").assert;

var doesFileExist; // the module to test
var existsSyncStub; // the fake method on the dependency

describe("example", function () {
  beforeEach(function () {
    existsSyncStub = sinon.stub(); // create a stub for every test

    // import the module to test, using a fake dependency
    doesFileExist = proxyquire("../lib/does-file-exist", {
      fs: {
        existsSync: existsSyncStub,
      },
    });
  });

  describe("when a path exists", function () {
    beforeEach(function () {
      existsSyncStub.returns(true); // set the return value that we want
    });

    it("should return `true`", function () {
      var actual = doesFileExist("9d7af804-4719-4578-ba1d-5dd8a4dae89f");

      assert.isTrue(actual);
    });
  });
});
```

[seams]: http://www.informit.com/articles/article.aspx?p=359417
[proxyquire]: https://github.com/thlorenz/proxyquire
[demo-proxyquire]: https://github.com/sinonjs/demo-proxyquire
[legacy]: https://www.goodreads.com/book/show/44919.Working_Effectively_with_Legacy_Code
[quibble]: https://www.npmjs.com/package/quibble
