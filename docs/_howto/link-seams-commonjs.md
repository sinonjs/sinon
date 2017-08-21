---
layout: page
title: How to use Link Seams with CommonJS
---

This page describes how to isolate your system under test, by stubbing out dependencies with [link seams][seams].

This is the CommonJS version, so we will be using [proxyquire][proxyquire] to construct our seams.

To better understand the example and get a good description of what seams are, we recommend that you read the [seams (all 3 web pages)][seams] excerpt from [Working Effectively with Legacy Code][legacy] before proceeding.

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
var fs = require('fs');

function doesFileExist(path){
    return fs.existsSync(path);
}

module.exports = doesFileExist;
```

### Test file: `test/does-file-exist.test.js`

In order to isolate our `doesFileExist` module for testing, we will stub out `fs` and provide a fake implementation of `fs.existsSync`, where we have complete control of the behaviour.

```javascript
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var assert = require('referee').assert;

var doesFileExist; // the module to test
var existsSyncStub; // the fake method on the dependency

describe('example', function () {
    beforeEach(function () {
        existsSyncStub = sinon.stub(); // create a stub for every test

        // import the module to test, using a fake dependency
        doesFileExist = proxyquire('../lib/does-file-exist', {
            fs: {
                existsSync: existsSyncStub
            }
        });
    });

    describe('when a path exists', function () {
        beforeEach(function() {
            existsSyncStub.returns(true); // set the return value that we want
        });

        it('should return `true`', function () {
            var actual = doesFileExist('9d7af804-4719-4578-ba1d-5dd8a4dae89f');

            assert.isTrue(actual);
        });
    });
});
```

[seams]: http://www.informit.com/articles/article.aspx?p=359417
[proxyquire]: https://github.com/thlorenz/proxyquire
[demo-proxyquire]: https://github.com/sinonjs/demo-proxyquire
[legacy]: https://www.goodreads.com/book/show/44919.Working_Effectively_with_Legacy_Code
