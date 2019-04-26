---
layout: page
title: Dependency mocking with Sinon
---
This page describes how to isolate your system under test, by stubbing out dependencies.

While in other languages you might use [link seams][seams], [Dependency Injection(DI)][di] or
[Inversion or Control(IoT)][IoT], which are not just _patterns_ but also requires some pattern
implementation(a framework) - CommonJS(aka nodejs) module system provides a way better to replace
any module, or package you need - _require-time_ dependency replacement.

## Why
Before we started, let's clarify why you could not use _just Sinon_ to mock.
### Source file:  `file.js`
A short script, which does a quite important and a very dangerous action. Hopefully only for a `root` user.
```javascript
const fs = require('fs');
const isRoot = require('./isRoot');

const wasRoot = isRoot(); // lets just precache it! Why not?

exports.deleteEverything = function () {
  if (wasRoot) {
    throw new Error('only for a true root, ' + isRoot() ? 'sudoer' : 'user')
  }
  fs.removeAllFiles();
}
```
### Test file: `file.test.js`
Keep in mind - the test should be repeatable.
```javascript
const file = require('./file');

// you can stub deleteEverything
sinon.stub(file, 'deleteEverything');
// you can "safely" call it
file.deleteEverything();
// but how could it help?
```
In short - you can't test this file at all if you are not a root. And if you are, well, say goodbye to your file system.

To solve tasks like this, `fs` and `./isRoot`, dependencies, not local or exported variables, should be stubbed and controlled.
Sinon could stub only something you export, not the way module is assembled.

### Why not Rewire
Another popular solution for this problem is to use [rewire][rewire], which may _rewire_ module from inside.
```js
const file = rewire('./file');
file.__set__('fs', sinon.stub())
```
Actually, the code above would not work, by design, as long as is not compatible with `const` declaration we used to define `fs`.
Yes, you may use `let` or `var`, but is it a good solution?
From another point of view, tests would require changing `wasRoot` value, which is derived from `isRoot` and should be the same, while
you will have to mock them separately. This library is for _monkey-patching_, not for mocking.

### Mock-fs
It might be obvious, that [mock-fs][mock-fs] (which _mocks fs_) would help here - if `fs` is not real, then your files
would not been deleted during tests. Unfortunately it would not work again.
- firstly - how to control `isRoot` and `wasRoot`?
- secondary - some testing systems, like [ava][ava], or other modules, you dont have intention to mock, might require
a _real_ `fs`. So there is no way to use such _global_ hooks.

### Overall
There is an even more obvious reason why non require-time mocking is a bad idea.
Sinon(`.stub(exports)`) or Rewire(internal rewire) are working __after file got required__ and initialized,
thus - could not be used to sandbox or isolate system under test. It's too late.

## Dependency Mocking
"Dependency Mocking" is about replacing one __module__ by another. Replace `fs` as a module, not a local variable.
There are many different libraries, and some of them are even not "require-time" mocking, and
all they are doing their job a bit differently. Roughly in two different ways:
- [proxyquire][proxyquire] and [rewiremock][rewiremock] would replace __direct__ dependencies
- [mock-require][mock-require] and [mockery][mockery] would replace __any__ dependency

Usually the first variant is better, as long as you are mocking, and might mock, only something you know - the
system under test and it's explicit dependencies, so everything is _scoped_.
The second variant is also very valuable, and you might need need from time to time.

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
const proxyquire = require('proxyquire').noPreserveCache();
const sinon = require('sinon');
const assert = require('referee').assert;

let doesFileExist; // the module to test
let existsSyncStub; // the fake method on the dependency

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
        it('should return `true`', function () {
            existsSyncStub.returns(true); // set the return value that we want
            var actual = doesFileExist('9d7af804-4719-4578-ba1d-5dd8a4dae89f');

            assert.isTrue(existsSyncStub.calledWith('9d7af804-4719-4578-ba1d-5dd8a4dae89f'));
            assert.isTrue(actual);
        });

        it('should return `false`', function () {
            existsSyncStub.returns(false); // set the return value that we want
            var actual = doesFileExist('9d7af804-4719-4578-ba1d-5dd8a4dae89f');

            assert.isTrue(existsSyncStub.called);
            assert.isFalse(actual);
        });
    });
});
```
Look at the example above - code coverage is 100%. We have tested all branches we need,
and even tested that `fs.existsSync` was called with a right arguments.

Dependency mocking is a powerful tool, but sometimes you have to extract some functionality
to another module to be able to mock it.


[IoT]: https://en.wikipedia.org/wiki/Inversion_of_control
[di]: https://en.wikipedia.org/wiki/Dependency_injection
[ava]: https://github.com/avajs/ava
[mock-fs]: https://github.com/tschaub/mock-fs
[rewire]: https://github.com/jhnns/rewire
[seams]: http://www.informit.com/articles/article.aspx?p=359417
[proxyquire]: https://github.com/thlorenz/proxyquire
[demo-proxyquire]: https://github.com/sinonjs/demo-proxyquire
[legacy]: https://www.goodreads.com/book/show/44919.Working_Effectively_with_Legacy_Code
