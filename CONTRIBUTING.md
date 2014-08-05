# Contributing to Sinon.JS

Pick [an issue](http://github.com/cjohansen/Sinon.JS/issues) to fix, or pitch
new features. To avoid wasting your time, please ask for feedback on feature
suggestions either with [an issue](http://github.com/cjohansen/Sinon.JS/issues/new)
or on [the mailing list](http://groups.google.com/group/sinonjs).

## Run the tests

The Sinon.JS developer environment requires Node/NPM. Please make sure you have
Node installed, and install Sinon's dependencies:

    $ npm install

### On Node

    $ npm test

### In the browser

Some tests needs working XHR to pass. To run the tests over an HTTP server, run

    $ node_modules/http-server/bin/http-server

#### Testing in development

Open [localhost:8080/test/sinon.html](http://localhost:8080/test/sinon.html) in a browser.

#### Testing a built version

To test against a built distribution, first
make sure you have a build (requires [Ruby][ruby] and [Juicer][juicer]):

    $ ./build

[ruby]: https://www.ruby-lang.org/en/
[juicer]: http://rubygems.org/gems/juicer

If the build script is unable to find Juicer, try

    $ ruby -rubygems build

Open [localhost:8080/test/sinon-dist.html](http://localhost:8080/test/sinon-dist.html) in a browser.

### On Rhino

The Rhino tests are currently out of commission (pending update after switch to
Buster.JS for tests).

### In PhantomJS

If you have [PhantomJS](http://phantomjs.org) installed as a global, you can run the test suite in PhantomJS

```
$ test/phantom/run.sh
```
