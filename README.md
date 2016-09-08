# Sinon.JS

[![npm version](https://img.shields.io/npm/v/sinon.svg?style=flat)](https://www.npmjs.com/package/sinon) [![Join the chat at https://gitter.im/sinonjs/sinon](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/sinonjs/sinon?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Build status](https://secure.travis-ci.org/sinonjs/sinon.svg?branch=master)](http://travis-ci.org/sinonjs/sinon) [![bitHound Score](https://www.bithound.io/github/sinonjs/sinon/badges/score.svg)](https://www.bithound.io/github/sinonjs/sinon) [![Sauce Test Status](https://saucelabs.com/buildstatus/sinonjs)](https://saucelabs.com/u/sinonjs) [![Coverage Status](https://coveralls.io/repos/github/sinonjs/sinon/badge.svg)](https://coveralls.io/github/sinonjs/sinon)

Standalone and test framework agnostic JavaScript test spies, stubs and mocks (pronounced "sigh-non").

[![Sauce Test Status](https://saucelabs.com/browser-matrix/sinonjs.svg)](https://saucelabs.com/u/sinonjs)

## Installation

via [npm (node package manager)](https://github.com/npm/npm)

    $ npm install sinon

or via sinon's browser builds available for download on the [homepage](http://sinonjs.org/download/).

## Usage

See the [sinon project homepage](http://sinonjs.org/) for documentation on usage.

If you have questions that are not covered by the documentation, please post them to the [Sinon.JS mailing list](http://groups.google.com/group/sinonjs) or drop by <a href="irc://irc.freenode.net:6667/sinon.js">#sinon.js on irc.freenode.net:6667</a> or the [Gitter channel](https://gitter.im/sinonjs/sinon).

### Important: Sinon v1.x does not work with AMD/CommonJS Bundlers!

Sinon.JS v1.x *as source* **doesn't work with AMD loaders / RequireJS / Webpack / Browserify**. For that you will have to use a pre-built version. You can either [build it yourself](CONTRIBUTING.md#testing-a-built-version) or get a numbered version from http://sinonjs.org.

This has been resolved in Sinon v2.x; Please don't report this as a bug.

## Goals

* No global pollution
* Easy to use
* Require minimal “integration”
* Easy to embed seamlessly with any testing framework
* Easily fake any interface
* Ship with ready-to-use fakes for XMLHttpRequest, timers and more

## Contribute?

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how you can contribute to Sinon.JS
